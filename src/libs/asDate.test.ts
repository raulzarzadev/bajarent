//@ts-nocheck

import asDate from './utils-date'

// asDate.test.ts
describe('asDate', () => {
  it('should return a date if date is passed', () => {
    const date = asDate(new Date())
    expect(date).toBeInstanceOf(Date)
  })
  it('should return a date if string string date is passed ', () => {
    const stringDate = '2021-10-01'
    const date = asDate(stringDate)
    expect(date).toBeInstanceOf(Date)
  })

  it('should return null for an invalid date string', () => {
    const dateString = 'invalid-date'
    const result = asDate(dateString)
    expect(result).toBeNull()
  })

  it('should handle empty string input', () => {
    const dateString = ''
    const result = asDate(dateString)
    expect(result).toBeNull()
  })

  it('should handle null input', () => {
    const result = asDate(null)
    expect(result).toBeNull()
  })

  it('should handle undefined input', () => {
    const result = asDate(undefined)
    expect(result).toBeNull()
  })

  it('should handle numeric input', () => {
    const timestamp = 1633072800000 // Equivalent to 2021-10-01T00:00:00.000Z
    const result = asDate(timestamp)
    expect(result).toBeInstanceOf(Date)
    expect(result.getTime()).toEqual(timestamp)
  })
})
