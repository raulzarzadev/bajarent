const extractCoordsFromUrl = (url: string): [number | null, number | null] => {
  /**
   * Extract latitude and longitude from a Google Maps URL.
   *
   * @param url - Google Maps URL as a string.
   * @return A tuple containing latitude and longitude as numbers, or [null, null] if not found.
   */

  const regex = /@([0-9.-]+),([0-9.-]+)/
  const match = url.match(regex)
  if (match) {
    const [_, latitude, longitude] = match
    return [parseFloat(latitude), parseFloat(longitude)]
  } else {
    return null
    return [null, null]
  }
}

export default extractCoordsFromUrl
