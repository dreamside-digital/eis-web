import { NextResponse } from 'next/server'
import { directus } from '@/services/directus'
import { updateItem, readItem } from '@directus/sdk'
import sharp from 'sharp'
import { kMeansPalette } from '@/lib/color-utils'

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (token !== process.env.DIRECTUS_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { artwork_id } = await request.json()
    if (!artwork_id) {
      return NextResponse.json({ error: 'artwork_id is required' }, { status: 400 })
    }

    const api = directus(process.env.DIRECTUS_TOKEN)

    // Fetch artwork to get first image
    const artwork = await api.request(
      readItem('artworks', artwork_id, {
        fields: ['id', 'images.directus_files_id.id'],
      })
    )

    const imageId = artwork?.images?.[0]?.directus_files_id?.id
    if (!imageId) {
      return NextResponse.json({ error: 'Artwork has no images' }, { status: 400 })
    }

    // Fetch the image as a 200x200 thumbnail
    const imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageId}?width=200&height=200&fit=cover`
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    // Extract raw pixel data using Sharp
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Run k-means to extract 5 dominant colours
    const palette = kMeansPalette(data, 5, info.channels)

    // Update the artwork in Directus
    await api.request(
      updateItem('artworks', artwork_id, { color_palette: palette })
    )

    return NextResponse.json({ artwork_id, palette })
  } catch (error) {
    console.error('Error extracting palette:', error)
    return NextResponse.json(
      { error: 'Failed to extract palette' },
      { status: 500 }
    )
  }
}
