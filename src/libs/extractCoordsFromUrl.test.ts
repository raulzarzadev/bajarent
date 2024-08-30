import extractCoordsFromUrl from '../libs/extractCoordsFromUrl'

const one = `https://maps.google.com/?q=24.164223,-110.314148`
const two = `https://www.google.com/maps/place/24%C2%B009'51.2%22N+110%C2%B018'50.9%22W/@24.164223,-110.314148,17z/data=!3m1!4b1!4m4!3m3!8m2!3d24.164223!4d-110.314148?entry=ttu&g_ep=EgoyMDI0MDgyNy4wIKXMDSoASAFQAw%3D%3D`
const three = `https://www.google.com/maps/search/24.164223,-110.314148?entry=tts&g_ep=EgoyMDI0MDgyNy4wKgBIAVAD`
const four =
  'https://consent.google.com/m?continue=https://www.google.com/maps/search/24.164223,-110.314148?entry%3Dtts%26g_ep%3DEgoyMDI0MDgyNy4wKgBIAVAD&gl=DE&m=0&pc=m&uxe=eomtm&cm=2&hl=de&src=1'

const expectedCoords = [24.164223, -110.314148]
describe('extractCoordsFromUrl', () => {
  it('should return the coordinates from a valid URL with ?q=lat,lng', () => {
    const url = one

    const result = extractCoordsFromUrl(url)

    expect(result).toEqual(expectedCoords)
  })

  it('should return the coordinates from a valid URL with @lat,lng', () => {
    const url = two

    const result = extractCoordsFromUrl(url)

    expect(result).toEqual(expectedCoords)
  })

  it('should return the coordinates from a valid URL with maps/search/lat,lng', () => {
    const url = three

    const result = extractCoordsFromUrl(url)

    expect(result).toEqual(expectedCoords)
  })

  it('should return null for an invalid URL', () => {
    const url = 'https://www.example.com'

    const result = extractCoordsFromUrl(url)

    expect(result).toBeNull()
  })
})
