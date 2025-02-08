export const geocodeAddress = async(searchTerm) => {
    const mapboxUrl = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURI(searchTerm)}&country=ca&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    const result = await fetch(mapboxUrl)
    const data = await result.json()
    return data
}

export const reverseGeocodeLocation = async(coords) => {
    const mapboxUrl = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${coords.longitude}&latitude=${coords.latitude}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    const result = await fetch(mapboxUrl)
    const data = await result.json()
    return data
}