//@ts-nocheck
import containCoordinates from './containCoordinates'

describe('containCoordinates', () => {
	test('should return true and coordinates for format "23.3424, -23.234"', () => {
		const input = '23.3424, -23.234'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, -23.234])
	})

	test('should return true and coordinates for format with quotes "23.3424, -23.234"', () => {
		const input = '"23.3424, -23.234"'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, -23.234])
	})

	test('should return true and coordinates for format [23.3424, -23.234]', () => {
		const input = '[23.3424, -23.234]'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, -23.234])
	})

	test('should handle positive and negative coordinates', () => {
		const input = '23.3424, -23.234'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, -23.234])
	})

	test('should handle coordinates with extra spaces', () => {
		const input = '  23.3424  ,  -23.234  '
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, -23.234])
	})

	test('should return false for invalid format', () => {
		const input = 'This is not a coordinate'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(false)
		expect(result.coords).toBeNull()
	})

	test('should handle integers', () => {
		const input = '23, -23'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23, -23])
	})

	test('should handle coordinates with + sign', () => {
		const input = '+23.3424, +23.234'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, 23.234])
	})

	test('should handle coordinates with single quotes', () => {
		const input = "'23.3424, -23.234'"
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, -23.234])
	})

	test('should handle edge case with brackets inside quotes', () => {
		const input = '"[23.3424, -23.234]"'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([23.3424, -23.234])
	})

	test('should return false for empty string', () => {
		const input = ''
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(false)
		expect(result.coords).toBeNull()
	})
	test('should return coordinates if full link is passed', () => {
		const input =
			'https://www.google.com/maps/search/24.147742,+-110.326177?entry=tts&g_ep=EgoyMDI1MDMxMC4wIPu8ASoASAFQAw%3D%3D'
		const result = containCoordinates(input)
		expect(result.containCoords).toBe(true)
		expect(result.coords).toEqual([24.147742, -110.326177])
	})
})
