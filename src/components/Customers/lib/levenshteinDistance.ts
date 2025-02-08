function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(null))

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Eliminación
        matrix[i][j - 1] + 1, // Inserción
        matrix[i - 1][j - 1] + cost // Sustitución
      )
    }
  }
  return matrix[a.length][b.length]
}

// Función para encontrar el substring común más largo
function longestCommonSubstring(str1: string, str2: string): string {
  const rows = str1.length,
    cols = str2.length
  let maxLen = 0,
    endIndex = 0
  const table: number[][] = Array.from({ length: rows + 1 }, () =>
    Array(cols + 1).fill(0)
  )
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1
        if (table[i][j] > maxLen) {
          maxLen = table[i][j]
          endIndex = i
        }
      }
    }
  }
  return str1.slice(endIndex - maxLen, endIndex)
}

export function findBestMatch(customers: string[], query: string) {
  let bestMatch = null
  let lowestDistance = Infinity

  for (const customer of customers) {
    const distance = levenshteinDistance(
      customer.toLowerCase(),
      query.toLowerCase()
    )
    if (distance < lowestDistance) {
      lowestDistance = distance
      bestMatch = customer
    }
  }

  return bestMatch
}
export function levenshteinDistanceExtended(
  a: string,
  b: string
): { distance: number; matchBonus: number } {
  const baseDistance = levenshteinDistance(a, b)
  const lcs = longestCommonSubstring(a, b)
  const matchBonus = lcs.length // bonus igual al largo del substring común
  return { distance: baseDistance, matchBonus }
}

export function findBestMatches(data: string[], query: string, count = 1) {
  if (!data.length)
    return {
      matches: null
    }
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/)

  const matches = data.map((item) => {
    const lowerCustomer = item.toLowerCase()
    const words = lowerCustomer.split(/\s+/)

    // 1️⃣ Distancia de Levenshtein con la cadena completa
    const { distance, matchBonus } = levenshteinDistanceExtended(
      lowerCustomer,
      lowerQuery
    )
    // 2️⃣ Coincidencia parcial (priorizar nombres que contienen directamente el query)
    const containsQuery = lowerCustomer.includes(lowerQuery) ? 1 : 0
    // 2️⃣ Ponderación basada en coincidencias de palabras clave
    let keywordMatches = 0
    for (const word of queryWords) {
      if (containsQuery) keywordMatches++
      if (words.includes(word)) keywordMatches++
    }

    return { item, distance: distance, matchBonus, keywordMatches }
  })

  // Ordenar primero por mayor cantidad de palabras clave coincidentes, luego por menor distancia
  const sortedAndSliced = [...matches]
    .sort((a, b) => {
      if (a.matchBonus === b.matchBonus) {
        return a.distance - b.distance
      }
      return b.matchBonus - a.matchBonus
    })
    .slice(0, count)
  console.log({ sortedAndSliced })
  return {
    matches: sortedAndSliced
  }
}

// 📌 Ejemplo de uso
// const customers = [
//   'Benito Juarez de Oretegon Progreso 1234 +5255433899452 +5244342691212',
//   'Maria Lopez de la Cruz Reforma 5678 +5255123456789 +524455667788'
// ]

//console.log(findBestMatch(customers, 'Benito Juarez Progreso 1234'))

//
