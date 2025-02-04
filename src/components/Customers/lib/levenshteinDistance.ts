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

export function findBestMatches(customers: string[], query: string, count = 1) {
  if (!customers.length) return null
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/)

  const matches = customers.map((customer) => {
    const lowerCustomer = customer.toLowerCase()
    const words = lowerCustomer.split(/\s+/)

    // 1️⃣ Distancia de Levenshtein con la cadena completa
    const distance = levenshteinDistance(lowerCustomer, lowerQuery)
    // 2️⃣ Coincidencia parcial (priorizar nombres que contienen directamente el query)
    const containsQuery = lowerCustomer.includes(lowerQuery) ? 1 : 0
    // 2️⃣ Ponderación basada en coincidencias de palabras clave
    let keywordMatches = 0
    for (const word of queryWords) {
      if (containsQuery) keywordMatches++
      if (words.includes(word)) keywordMatches++
    }

    return { customer, distance, keywordMatches }
  })

  // Ordenar primero por mayor cantidad de palabras clave coincidentes, luego por menor distancia
  matches.sort((a, b) => {
    if (b.keywordMatches !== a.keywordMatches) {
      return b.keywordMatches - a.keywordMatches
    }
    return a.distance - b.distance
  })

  console.log({ query, matches })

  return matches.map((match) => match.customer).slice(0, count)
}

// 📌 Ejemplo de uso
const customers = [
  'Benito Juarez de Oretegon Progreso 1234 +5255433899452 +5244342691212',
  'Maria Lopez de la Cruz Reforma 5678 +5255123456789 +524455667788'
]

console.log(findBestMatch(customers, 'Benito Juarez Progreso 1234'))

//
