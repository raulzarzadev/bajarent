//@ts-nocheck
import { replaceUndefinedWithNull } from './removeUndefinedValues'

describe('replaceUndefinedWithNull', () => {
	it('should return null if the input is undefined', () => {
		const result = replaceUndefinedWithNull(undefined)
		expect(result).toBeNull()
	})

	it('should return null if the input is null', () => {
		const result = replaceUndefinedWithNull(null)
		expect(result).toBeNull()
	})

	it('should return the same value if the input is not an object', () => {
		expect(replaceUndefinedWithNull(42)).toBe(42)
		expect(replaceUndefinedWithNull('string')).toBe('string')
		expect(replaceUndefinedWithNull(true)).toBe(true)
	})

	it('should replace undefined values with null in an object', () => {
		const input = { a: 1, b: undefined, c: 'test' }
		const expected = { a: 1, b: null, c: 'test' }
		const result = replaceUndefinedWithNull(input)
		expect(result).toEqual(expected)
	})

	it('should replace undefined values with null in an array', () => {
		const input = [1, undefined, 'test']
		const expected = [1, null, 'test']
		const result = replaceUndefinedWithNull(input)
		expect(result).toEqual(expected)
	})

	it('should handle nested objects and arrays', () => {
		const input = {
			a: 1,
			b: { c: undefined, d: [2, undefined, { e: undefined }] }
		}
		const expected = { a: 1, b: { c: null, d: [2, null, { e: null }] } }
		const result = replaceUndefinedWithNull(input)
		expect(result).toEqual(expected)
	})

	it('should handle empty objects and arrays', () => {
		expect(replaceUndefinedWithNull({})).toEqual({})
		expect(replaceUndefinedWithNull([])).toEqual([])
	})
})
