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

    // Fetch all published, non-rented artworks with a color_palette
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
            { _or: [{ rented: { _null: true } }, { rented: { _eq: false } }] },
          ],
        },
        limit: -1,
      })
    )

    console.log(`[match] Found ${artworks.length} artworks with palettes`)
    artworks.forEach(a => {
      console.log(`[match]   - "${a.title}" (id: ${a.id}) palette: ${JSON.stringify(a.color_palette)}, images: ${a.images?.length || 0}`)
    })

    // Average Delta-E above this value is considered a perceptual mismatch.
    // Delta-E scale: ~10 = same family, ~25 = noticeable, ~40 = clearly different.
    const SCORE_THRESHOLD = 42

    // All valid artworks scored and sorted — used as the Phase 2 fallback
    const allSorted = artworks
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

    // Threshold-filtered candidates for the unique-artist pool
    const sorted = allSorted.filter(a => a.score <= SCORE_THRESHOLD)

    console.log(`[match] ${sorted.length} artworks within threshold (≤${SCORE_THRESHOLD})`)

    // Phase 1: collect up to POOL_SIZE top-scoring artworks, one per artist
    const POOL_SIZE = 8
    const seenArtists = new Set()
    const pool = []

    for (const artwork of sorted) {
      if (!seenArtists.has(artwork.artist)) {
        seenArtists.add(artwork.artist)
        pool.push(artwork)
        if (pool.length >= POOL_SIZE) break
      }
    }

    // Fisher-Yates shuffle the unique-artist pool for result freshness
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]]
    }

    const scored = pool.slice(0, 4)

    // Phase 2: if still short, fill from the full unthresholded list regardless of artist
    if (scored.length < 4) {
      const scoredIds = new Set(scored.map(a => a.id))
      for (const artwork of allSorted) {
        if (scored.length >= 4) break
        if (!scoredIds.has(artwork.id)) scored.push(artwork)
      }
    }

    console.log(`[match] Returning ${scored.length} results (after filtering for images)`)
    scored.forEach(s => {
      console.log(`[match]   - "${s.title}" by ${s.artist} score: ${s.score.toFixed(2)}`)
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
