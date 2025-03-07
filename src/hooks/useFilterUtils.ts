// src/hooks/useFilterUtils.ts
import { findBestMatches } from '../components/Customers/lib/levenshteinDistance'
import { processData } from '../libs/flattenData'

export type Filter = { field: string; value: string | number | boolean }

/**
 * Filtra datos según una lista de filtros
 */
export function filterDataByFields<T>(data: T[], filters: Filter[]): T[] {
  return data?.filter((item) => {
    return filters?.every((filter) => {
      return item?.[filter?.field] === filter?.value
    })
  })
}

/**
 * Filtra por IDs personalizados
 */
export function filterByCustomIds<T extends { id?: string }>(
  data: T[],
  ids: string[]
): T[] {
  return data.filter((item) => ids.includes(item?.id || ''))
}

/**
 * Maneja la lógica de actualización de filtros
 */
export function handleFilterUpdate<T>(
  currentFilters: Filter[],
  field: string,
  value: string | boolean | number | string[],
  currentData: T[]
): { filters: Filter[]; filteredData: T[] } {
  // Si es un filtro de IDs personalizados
  if (field === 'customIds' && Array.isArray(value)) {
    const newFilters = [{ field: 'customIds', value: 'Custom Filter' }]
    const filteredData = filterByCustomIds(currentData, value as string[])
    return { filters: newFilters, filteredData }
  }

  // Si el valor es un array (y no es customIds), no hacer cambios
  if (Array.isArray(value)) {
    return { filters: currentFilters, filteredData: currentData }
  }

  // Verificar si existe un filtro igual
  const sameExist = currentFilters.some(
    (a) => a.field === field && a.value === value
  )

  // Verificar si existe un filtro similar (mismo campo)
  const similarExist = currentFilters.some((a) => a.field === field)

  // Si existe el mismo filtro, eliminarlo
  if (sameExist) {
    const cleanedFilters = currentFilters.filter(
      (a) => !(a.field === field && a.value === value)
    )
    const filteredData = filterDataByFields(currentData, cleanedFilters)
    return { filters: cleanedFilters, filteredData }
  }

  // Si existe un filtro similar, reemplazarlo
  if (similarExist) {
    const cleanedFilters = currentFilters.filter((a) => a.field !== field)
    const newFilters = [...cleanedFilters, { field, value }]
    const filteredData = filterDataByFields(currentData, newFilters)
    return { filters: newFilters, filteredData }
  }

  // Caso especial para filtros de fecha
  const isFilteredByDates = currentFilters.some((a) => a.field === 'dates')
  if (isFilteredByDates) {
    const newFilters = [...currentFilters, { field, value }]
    const filtersWithoutDates = newFilters.filter((a) => a.field !== 'dates')
    const filteredData = filterDataByFields(currentData, filtersWithoutDates)
    return { filters: newFilters, filteredData }
  }

  // Agregar nuevo filtro
  const newFilters = [...currentFilters, { field, value }]
  const filteredData = filterDataByFields(currentData, newFilters)
  return { filters: newFilters, filteredData }
}

/**
 * Maneja la búsqueda en datos locales
 */
export function searchInLocalData<T extends { id?: string }>(
  data: T[],
  searchValue: string,
  filters: Filter[] = []
): { matchedData: T[]; allMatchedData: T[] } {
  if (!searchValue) {
    return { matchedData: data, allMatchedData: data }
  }

  const processedData = data.map(processData)
  const { matches } = findBestMatches(processedData, searchValue)

  // Filtrar por matches exactos (keywordMatches > 0)
  const realMatches = matches?.filter((m) => m.keywordMatches > 0)

  // Filtrar por matches similares (matchBonus > 3)
  const similarMatches = matches?.filter((m) => m.matchBonus > 3)

  // Obtener los datos correspondientes a los matches
  const matchedItemData = realMatches
    ?.map((a) => data.find((b) => b.id === a.item.split(' ')[0]))
    .filter(Boolean) as T[]

  const similarMatchedItemData = similarMatches
    ?.map((a) => data.find((b) => b.id === a.item.split(' ')[0]))
    .filter(Boolean) as T[]

  // Aplicar filtros adicionales si existen
  const filteredMatchedData =
    filters.length > 0
      ? filterDataByFields(matchedItemData, filters)
      : matchedItemData

  return {
    matchedData: filteredMatchedData,
    allMatchedData: [...matchedItemData, ...similarMatchedItemData]
  }
}
