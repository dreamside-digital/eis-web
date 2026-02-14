// Curated swatches: 25 colours across 5 families
export const CURATED_SWATCHES = [
  // Warm
  { name: 'Crimson', hex: '#8B0000', family: 'warm' },
  { name: 'Cardinal', hex: '#C41E3A', family: 'warm' },
  { name: 'Flame', hex: '#E25822', family: 'warm' },
  { name: 'Goldenrod', hex: '#D4A017', family: 'warm' },
  { name: 'Raw Sienna', hex: '#DAA520', family: 'warm' },
  // Earth
  { name: 'Saddle Brown', hex: '#8B4513', family: 'earth' },
  { name: 'Burnt Sienna', hex: '#A0522D', family: 'earth' },
  { name: 'Sand', hex: '#C7B299', family: 'earth' },
  { name: 'Olive', hex: '#556B2F', family: 'earth' },
  { name: 'Forest', hex: '#2E4600', family: 'earth' },
  // Cool
  { name: 'Evergreen', hex: '#1B4D3E', family: 'cool' },
  { name: 'Teal', hex: '#008080', family: 'cool' },
  { name: 'Steel Blue', hex: '#4682B4', family: 'cool' },
  { name: 'Prussian Blue', hex: '#1E3A5F', family: 'cool' },
  { name: 'Midnight', hex: '#191970', family: 'cool' },
  // Purple/Pink
  { name: 'Indigo', hex: '#4B0082', family: 'purple' },
  { name: 'Violet', hex: '#6A0DAD', family: 'purple' },
  { name: 'Amethyst', hex: '#9966CC', family: 'purple' },
  { name: 'Pale Rose', hex: '#DB7093', family: 'purple' },
  { name: 'Blush', hex: '#FFB6C1', family: 'purple' },
  // Neutrals
  { name: 'Charcoal', hex: '#1C1C1C', family: 'neutral' },
  { name: 'Dim Grey', hex: '#696969', family: 'neutral' },
  { name: 'Silver', hex: '#C0C0C0', family: 'neutral' },
  { name: 'Linen', hex: '#FAF0E6', family: 'neutral' },
  { name: 'Ivory', hex: '#FFFFF0', family: 'neutral' },
]

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}

// Convert RGB to CIELAB via XYZ for perceptual colour distance
export function rgbToLab({ r, g, b }) {
  // Normalize to 0-1 and apply sRGB companding
  let rr = r / 255
  let gg = g / 255
  let bb = b / 255

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92

  // Convert to XYZ (D65 illuminant)
  let x = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047
  let y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750)
  let z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883

  const f = t => t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116

  x = f(x)
  y = f(y)
  z = f(z)

  return {
    L: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  }
}

// CIE76 colour distance
export function deltaE(lab1, lab2) {
  return Math.sqrt(
    Math.pow(lab1.L - lab2.L, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  )
}

// Greedy best-match pairing of two colour palettes (1-5 colours each)
export function paletteSimilarity(palette1, palette2) {
  const labs1 = palette1.map(hex => rgbToLab(hexToRgb(hex)))
  const labs2 = palette2.map(hex => rgbToLab(hexToRgb(hex)))
  const used = new Set()
  let total = 0

  for (const lab1 of labs1) {
    let bestDist = Infinity
    let bestIdx = -1
    for (let j = 0; j < labs2.length; j++) {
      if (used.has(j)) continue
      const dist = deltaE(lab1, labs2[j])
      if (dist < bestDist) {
        bestDist = dist
        bestIdx = j
      }
    }
    used.add(bestIdx)
    total += bestDist
  }

  return total
}

// Best (lowest) similarity across user's palettes vs one artwork palette
export function matchScore(userPalettes, artworkPalette) {
  let best = Infinity
  for (const palette of userPalettes) {
    const score = paletteSimilarity(palette, artworkPalette)
    if (score < best) best = score
  }
  return best
}

// K-means clustering for extracting dominant colours from pixel buffer
// pixelData: Uint8Array of RGBA or RGB pixel values
// k: number of clusters (default 5)
// channels: 3 for RGB, 4 for RGBA
export function kMeansPalette(pixelData, k = 5, channels = 3) {
  const pixels = []
  for (let i = 0; i < pixelData.length; i += channels) {
    pixels.push([pixelData[i], pixelData[i + 1], pixelData[i + 2]])
  }

  if (pixels.length === 0) return []

  // Initialize centroids using k-means++ style: evenly spaced samples
  const step = Math.max(1, Math.floor(pixels.length / k))
  let centroids = []
  for (let i = 0; i < k; i++) {
    centroids.push([...pixels[Math.min(i * step, pixels.length - 1)]])
  }

  const maxIter = 20
  for (let iter = 0; iter < maxIter; iter++) {
    // Assign pixels to nearest centroid
    const clusters = Array.from({ length: k }, () => [])
    for (const px of pixels) {
      let minDist = Infinity
      let nearest = 0
      for (let c = 0; c < k; c++) {
        const dist =
          (px[0] - centroids[c][0]) ** 2 +
          (px[1] - centroids[c][1]) ** 2 +
          (px[2] - centroids[c][2]) ** 2
        if (dist < minDist) {
          minDist = dist
          nearest = c
        }
      }
      clusters[nearest].push(px)
    }

    // Recompute centroids
    let converged = true
    for (let c = 0; c < k; c++) {
      if (clusters[c].length === 0) continue
      const newCentroid = [0, 0, 0]
      for (const px of clusters[c]) {
        newCentroid[0] += px[0]
        newCentroid[1] += px[1]
        newCentroid[2] += px[2]
      }
      newCentroid[0] = Math.round(newCentroid[0] / clusters[c].length)
      newCentroid[1] = Math.round(newCentroid[1] / clusters[c].length)
      newCentroid[2] = Math.round(newCentroid[2] / clusters[c].length)

      if (
        newCentroid[0] !== centroids[c][0] ||
        newCentroid[1] !== centroids[c][1] ||
        newCentroid[2] !== centroids[c][2]
      ) {
        converged = false
      }
      centroids[c] = newCentroid
    }

    if (converged) break
  }

  // Sort by brightness (darkest first) for consistent ordering
  centroids.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]))

  return centroids.map(([r, g, b]) => rgbToHex(r, g, b))
}
