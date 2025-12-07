import { describe, expect, test } from 'bun:test'
import {
	filterByCustomIds,
	filterDataByFields,
	handleFilterUpdate,
	searchInLocalData
} from './useFilterUtils'

// Datos de prueba
const mockData = [
	{
		id: '1',
		status: 'active',
		type: 'RENT',
		amount: 100,
		customerName: 'Juan Pérez'
	},
	{
		id: '2',
		status: 'completed',
		type: 'RENT',
		amount: 200,
		customerName: 'María López'
	},
	{
		id: '3',
		status: 'active',
		type: 'REPAIR',
		amount: 150,
		customerName: 'Carlos Ruiz'
	},
	{
		id: '4',
		status: 'cancelled',
		type: 'SALE',
		amount: 300,
		customerName: 'Ana García'
	},
	{
		id: '5',
		status: 'active',
		type: 'REPAIR',
		amount: 250,
		customerName: 'Pedro Martínez'
	}
]

describe('filterDataByFields', () => {
	test('debería filtrar datos correctamente por un campo', () => {
		const filters = [{ field: 'status', value: 'active' }]
		const result = filterDataByFields(mockData, filters)

		expect(result).toHaveLength(3)
		expect(result.map(item => item.id)).toEqual(['1', '3', '5'])
	})

	test('debería filtrar datos correctamente por múltiples campos', () => {
		const filters = [
			{ field: 'status', value: 'active' },
			{ field: 'type', value: 'REPAIR' }
		]
		const result = filterDataByFields(mockData, filters)

		expect(result).toHaveLength(2)
		expect(result.map(item => item.id)).toEqual(['3', '5'])
	})

	test('debería devolver un array vacío si ningún elemento cumple los filtros', () => {
		const filters = [
			{ field: 'status', value: 'pending' } // No existe este estado
		]
		const result = filterDataByFields(mockData, filters)

		expect(result).toHaveLength(0)
	})
})

describe('filterByCustomIds', () => {
	test('debería filtrar datos por IDs', () => {
		const result = filterByCustomIds(mockData, ['1', '4'])

		expect(result).toHaveLength(2)
		expect(result.map(item => item.id)).toEqual(['1', '4'])
	})

	test('debería devolver array vacío si no hay coincidencias', () => {
		const result = filterByCustomIds(mockData, ['999', '888'])

		expect(result).toHaveLength(0)
	})
})

describe('handleFilterUpdate', () => {
	test('debería agregar un filtro nuevo', () => {
		const currentFilters = []
		const { filters, filteredData } = handleFilterUpdate(
			currentFilters,
			'status',
			'active',
			mockData
		)

		expect(filters).toEqual([{ field: 'status', value: 'active' }])
		expect(filteredData).toHaveLength(3)
	})

	test('debería eliminar un filtro existente', () => {
		const currentFilters = [{ field: 'status', value: 'active' }]
		const { filters, filteredData } = handleFilterUpdate(
			currentFilters,
			'status',
			'active',
			mockData
		)

		expect(filters).toEqual([])
		expect(filteredData).toEqual(mockData)
	})

	test('debería reemplazar un filtro similar', () => {
		const currentFilters = [{ field: 'status', value: 'active' }]
		const { filters, filteredData } = handleFilterUpdate(
			currentFilters,
			'status',
			'completed',
			mockData
		)

		expect(filters).toEqual([{ field: 'status', value: 'completed' }])
		expect(filteredData).toHaveLength(1)
		expect(filteredData[0].id).toBe('2')
	})

	test('debería manejar filtros de IDs personalizados', () => {
		const currentFilters = []
		const { filters, filteredData } = handleFilterUpdate(
			currentFilters,
			'customIds',
			['1', '3'],
			mockData
		)

		expect(filters).toEqual([{ field: 'customIds', value: 'Custom Filter' }])
		expect(filteredData).toHaveLength(2)
		expect(filteredData.map(item => item.id)).toEqual(['1', '3'])
	})
})

describe('searchInLocalData', () => {
	test('debería buscar coincidencias en datos locales', () => {
		const { matchedData } = searchInLocalData(mockData, 'pérez')

		expect(matchedData).toHaveLength(1)
		expect(matchedData[0].id).toBe('1')
	})

	test('debería devolver datos originales si no hay término de búsqueda', () => {
		const { matchedData } = searchInLocalData(mockData, '')

		expect(matchedData).toEqual(mockData)
	})

	test('debería aplicar filtros adicionales a resultados de búsqueda', () => {
		const filters = [{ field: 'type', value: 'RENT' }]
		const { matchedData } = searchInLocalData(mockData, 'pé', filters)

		expect(matchedData).toHaveLength(1)
		expect(matchedData[0].id).toBe('1')
	})
})
