import CoordsType from '../types/CoordsType'
const containCoordinates = (
  input: string
): {
  containCoords: boolean
  coords: CoordsType | null
} => {
  // Expresión regular para el formato ' 23.3424, -23.234'
  const regex1 =
    /['"]?\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*['"]?/
  // Expresión regular para el formato [23.3424, -23.234]
  const regex2 = /\[\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*\]/
  // Expresión regular para coordenadas en URLs de Google Maps (mejorada)
  const regex3 =
    /\/(?:maps\/)?search\/([-+]?[0-9]*\.?[0-9]+)\s*,\s*\+?([-+]?[0-9]*\.?[0-9]+)/
  // Expresión regular más genérica para coordenadas en cualquier parte de una URL
  const regex4 = /[?&,/]([-+]?[0-9]*\.?[0-9]+)\s*,\s*\+?([-+]?[0-9]*\.?[0-9]+)/

  let match = input.match(regex1)
  if (!match) {
    match = input.match(regex2)
  }
  if (!match) {
    match = input.match(regex3)
  }
  if (!match) {
    match = input.match(regex4)
  }

  const coords: CoordsType | null = match
    ? [parseFloat(match[1]), parseFloat(match[2])]
    : null

  // Verificar si la cadena coincide con alguna de las expresiones regulares
  return {
    containCoords:
      regex1.test(input) ||
      regex2.test(input) ||
      regex3.test(input) ||
      regex4.test(input),
    coords
  }
}
export default containCoordinates
