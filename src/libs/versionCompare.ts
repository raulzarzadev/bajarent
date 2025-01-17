/**
 *
 * @param v1 version a
 * @param v2 version b
 * @returns if v1 > v2 return 1, if v1 < v2 return 2, if v1 === v2 return 0, if the versions do not match in length return 3
 */
export function versionCompare(v1: string, v2: string): number {
  if (!v1 || !v2) return 3
  // Los valores siempre estan en format0  'x.x.x' donde cada x es un string pero un numero entrero
  // Convierte las versiones en arrays de números
  const versionLength = 3
  if (v1 === v2) return 0

  const arr1 = v1?.split('.')?.map((seg) => parseInt(seg, 10))
  const arr2 = v2?.split('.')?.map((seg) => parseInt(seg, 10))
  if (arr1.length !== versionLength || arr2.length !== versionLength) return 3
  for (let i = 0; i < versionLength; i++) {
    // Si el segmento de la primera versión es mayor que el de la segunda
    if (arr1[i] > arr2[i]) {
      return 1
    }
    // Si el segmento de la segunda versión es mayor que el de la primera
    if (arr1[i] < arr2[i]) {
      return 2
    }
  }
  // Si todos los segmentos son iguales
  return -1
}
