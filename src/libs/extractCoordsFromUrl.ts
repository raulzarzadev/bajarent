const extractCoordsFromUrl = (url: string): [number, number] | null => {
	console.log('Original URL:', url)

	// Decodificar la URL
	try {
		const decodedUrl = decodeURIComponent(url)
		debugger
		// Extraer la URL anidada si existe
		const nestedUrlMatch = decodedUrl.match(/continue=([^&]*)/)
		const targetUrl = nestedUrlMatch ? decodeURIComponent(nestedUrlMatch[1]) : decodedUrl

		// Expresión regular para encontrar coordenadas
		const regex = /([-+]*\d*\.\d+|\d+),\s*([+-]*\d*\.\d+|\d+)/

		const match = targetUrl.match(regex)

		if (match) {
			// Procesar las coordenadas para eliminar el símbolo + después del -
			const processCoordinate = (coord: string): string => {
				return coord.replace(/\+/g, '')
			}
			const stringCoords = processCoordinate(match[0])
			const arrayCoords = stringCoords.split(',')
			const latitude = parseFloat(arrayCoords[0])
			const longitude = parseFloat(arrayCoords[1])

			return [latitude, longitude]
		}
	} catch (error) {
		console.error('Error decoding URL:', error)
	}

	return null
}

export default extractCoordsFromUrl
