//@ts-nocheck
// /Users/zarza/Documents/projects/bajarent2/src/components/Customers/lib/normalizeCustomerName.test.ts

import { normalizeCustomerName } from './customerFromOrder'

describe('normalizeCustomerName', () => {
  it('should return the name in lowercase', () => {
    const result = normalizeCustomerName('John Doe')
    expect(result).toBe('John Doe')
  })

  it('should trim leading and trailing spaces', () => {
    const result = normalizeCustomerName('  John Doe  ')
    expect(result).toBe('John Doe')
  })

  it('should handle empty strings', () => {
    const result = normalizeCustomerName('')
    expect(result).toBe('')
  })

  it('should handle strings with only spaces', () => {
    const result = normalizeCustomerName('   ')
    expect(result).toBe('')
  })

  it('should handle names with multiple spaces between words', () => {
    const result = normalizeCustomerName('John   Doe')
    expect(result).toBe('John Doe')
  })

  it('should handle names with special characters', () => {
    const result = normalizeCustomerName('Jöhn Dœ')
    expect(result).toBe('Jöhn Dœ')
  })

  it('should handle names with numbers', () => {
    const result = normalizeCustomerName('John DOE 123')
    expect(result).toBe('John Doe 123')
  })
})
