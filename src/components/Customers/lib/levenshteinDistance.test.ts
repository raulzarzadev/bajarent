//@ts-nocheck
import { findBestMatches } from './levenshteinDistance'
describe('findBestMatch', () => {
  const customers = [
    'Benito Juarez de Oretegon Progreso 1234 +5255433899452 +5244342691212',
    'Maria Lopez de la Cruz Reforma 5678  +524455667788',
    'Juan Juarez de la Colina Progreso 1234 +5255433899452 +52486567691212'
  ]

  it('should find the best match for a given query', () => {
    const query = 'Benito Juarez '
    const result = findBestMatches(customers, query)
    expect(result[0]).toEqual(customers[0])
  })

  it('should return null if no customers are provided', () => {
    const query = 'Benito Juarez Progreso 1234'
    const result = findBestMatches([], query)
    expect(result).toBeNull()
  })

  it('should handle case insensitivity', () => {
    const query = 'benito juarez progreso 1234'
    const result = findBestMatches(customers, query)
    expect(result[0]).toEqual(customers[0])
  })

  it('should return the closest match if there is no exact match', () => {
    const query = 'Maria de la cruz'
    const result = findBestMatches(customers, query)
    expect(result[0]).toEqual(customers[1])
  })

  it('should return the first customer if all distances are equal', () => {
    const query = 'Progreso'
    const result = findBestMatches(customers, query)
    expect(result[0]).toEqual(customers[0])
  })
  it('should return count customers if has the same distance', () => {
    const query = 'Progreso 1234'
    const count = 2
    const result = findBestMatches(customers, query, count)
    expect(result).toEqual([customers[0], customers[2]])
  })
})
