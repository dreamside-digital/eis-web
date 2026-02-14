import { NextResponse } from 'next/server'
import { directus } from '@/services/directus'
import { readItems } from '@directus/sdk'
import { matchScore } from '@/lib/color-utils'

export async function POST(request) {
  try {
    const { palettes } = await request.json()

    if (!palettes?.length || palettes.length > 3) {
      return NextResponse.json(
        { error: 'Provide 1-3 palettes' },
        { status: 400 }
      )
    }

    for (const palette of palettes) {
      if (!Array.isArray(palette) || palette.length < 1 || palette.length > 5) {
        return NextResponse.json(
          { error: 'Each palette must contain 1-5 hex colours' },
          { status: 400 }
        )
      }
    }

    const api = directus(process.env.DIRECTUS_TOKEN)

    console.log('[match] Incoming palettes:', JSON.stringify(palettes))
    console.log('[match] Palette count:', palettes?.length, 'Palette sizes:', palettes?.map(p => p?.length))

    // Fetch all published artworks with a color_palette
    const artworks = await api.request(
      readItems('artworks', {
        fields: [
          'id',
          'title',
          'color_palette',
          'images.directus_files_id.id',
          'images.directus_files_id.width',
          'images.directus_files_id.height',
          'profile_id.public_name',
        ],
        filter: {
          _and: [
            { color_palette: { _nnull: true } },
            { status: { _eq: 'published' } },
          ],
        },
        limit: -1,
      })
    )

    console.log(`[match] Found ${artworks.length} published artworks with palettes`)
    artworks.forEach(a => {
      console.log(`[match]   - "${a.title}" (id: ${a.id}) palette: ${JSON.stringify(a.color_palette)}, images: ${a.images?.length || 0}`)
    })

    // Score and sort
    const scored = artworks
      .map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.profile_id?.public_name || 'Unknown Artist',
        color_palette: artwork.color_palette,
        image: artwork.images?.[0]?.directus_files_id || null,
        score: matchScore(palettes, artwork.color_palette),
      }))
      .filter(a => a.image)
      .sort((a, b) => a.score - b.score)
      .slice(0, 4)

    console.log(`[match] Returning ${scored.length} results (after filtering for images)`)
    scored.forEach(s => {
      console.log(`[match]   - "${s.title}" score: ${s.score.toFixed(2)}`)
    })

    return NextResponse.json({ matches: scored })
  } catch (error) {
    console.error('Error matching palettes:', error)
    return NextResponse.json(
      { error: 'Failed to match palettes' },
      { status: 500 }
    )
  }
}
