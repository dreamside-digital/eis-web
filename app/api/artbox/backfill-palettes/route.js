import { NextResponse } from 'next/server'
import { directus } from '@/services/directus'
import { readItems, updateItem } from '@directus/sdk'
import sharp from 'sharp'
import { kMeansPalette } from '@/lib/color-utils'

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (token !== process.env.DIRECTUS_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const api = directus(process.env.DIRECTUS_TOKEN)

    // Fetch all artworks that have images but no color_palette
    const artworks = await api.request(
      readItems('artworks', {
        fields: ['id', 'images.directus_files_id.id'],
        filter: {
          _and: [
            { images: { _nnull: true } },
            { color_palette: { _null: true } },
          ],
        },
        limit: -1,
      })
    )

    let processed = 0
    let failed = 0
    const errors = []

    for (const artwork of artworks) {
      const imageId = artwork?.images?.[0]?.directus_files_id?.id
      if (!imageId) {
        failed++
        errors.push({ id: artwork.id, error: 'No image found' })
        continue
      }

      try {
        const imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageId}?width=200&height=200&fit=cover`
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) throw new Error('Failed to fetch image')

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
        const { data, info } = await sharp(imageBuffer)
          .raw()
          .toBuffer({ resolveWithObject: true })

        const palette = kMeansPalette(data, 5, info.channels)

        await api.request(
          updateItem('artworks', artwork.id, { color_palette: palette })
        )

        processed++
      } catch (err) {
        failed++
        errors.push({ id: artwork.id, error: err.message })
      }
    }

    return NextResponse.json({ processed, failed, errors })
  } catch (error) {
    console.error('Error backfilling palettes:', error)
    return NextResponse.json(
      { error: 'Failed to backfill palettes' },
      { status: 500 }
    )
  }
}
