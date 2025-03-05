import { useEffect, useRef, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import { useOrdersCtx } from '../contexts/ordersContext'
import asDate from '../libs/utils-date'
import OrderType from '../types/OrderType'
import { useStore } from '../contexts/storeContext'
import { findBestMatches } from '../components/Customers/lib/levenshteinDistance'
import { processData } from '../libs/flattenData'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { useEmployee } from '../contexts/employeeContext'
export type Filter = { field: string; value: string | number | boolean }
export type CollectionSearch = {
  collectionName: string
  fields?: string[]
  assignedSections?: 'all' | string[]
  debouncedSearch?: number
}
export default function useFilter<T extends { id?: string }>({
  data = [],
  collectionSearch,
  debounceSearch = 0
}: {
  data: T[]
  collectionSearch?: CollectionSearch
  debounceSearch?: number
}) {
  const { storeId } = useStore()
  const { permissions } = useEmployee()
  const { reports } = useOrdersCtx()
  const [filteredData, setFilteredData] = useState<T[]>([...data])
  const [searchedData, setSearchedData] = useState<T[]>([])
  const [filteredBy, setFilteredBy] = useState<string | boolean | number>(
    'status'
  )
  const { data: customers } = useCustomers()
  const [customData, setCustomData] = useState<T[]>([])
  const [filtersBy, setFiltersBy] = useState<Filter[]>([])

  const filterBy = (
    field: string = 'status',
    value: string | boolean | number | string[]
  ) => {
    let filters = [...filtersBy]
    const currentFilteredData = [...filteredData]
    //* CUSTOM FILTERS SHOULD PROVIDE AN ARRAY OF STRINGS (IDS )
    if (field === 'customIds' && Array.isArray(value)) {
      filters = filters.filter((a) => a.field !== field)
      setFiltersBy([{ field: 'customIds', value: 'Custom Filter' }])
      const res = [...currentFilteredData].filter((order) => {
        return value.includes(order?.id)
      })
      setFilteredData(res)
      return
    }

    //* OMIT IF VALUE IS AN ARRAY
    if (Array.isArray(value)) return

    const sameExist = filters.some(
      (a) => a.field === field && a.value === value
    )
    const similarExist = filters.some((a) => a.field === field)

    //* If the same filter exist, remove it
    if (sameExist) {
      const cleanedFilters = [...filters].filter(
        (a) => !(a.field === field && a.value === value)
      )
      filters = cleanedFilters
      setFiltersBy(filters)
      //? here should bee filtered data from search but it just changes
      const res = filterDataByFields([...searchedData], filters)
      setFilteredData(res)
      return
    }

    //* If a similar filter exist, replace it
    if (similarExist) {
      const cleanedFilters = [...filters].filter((a) => !(a.field === field))
      filters = [...cleanedFilters, { field, value }]
      setFiltersBy(filters)
      const res = filterDataByFields(currentFilteredData, filters)
      setFilteredData(res)
      return
    }
    const isFilteredByDates = filtersBy.some((a) => a.field === 'dates')
    if (isFilteredByDates) {
      filters = [...filtersBy, { field, value }]
      const res = filterDataByFields(
        currentFilteredData,
        filters?.filter((a) => a.field !== 'dates')
      )
      setFilteredData(res)
      return
    }

    //* if similar or same fails add it
    filters = [...filtersBy, { field, value }]
    setFiltersBy(filters)
    const res = filterDataByFields(currentFilteredData, filters)
    setFilteredData(res)
  }

  const [searchValue, setSearchValue] = useState('')
  const arrayData = data.map((a) => {
    return processData(a)
  })
  const search = async (value: string) => {
    setSearchValue(value)
    if (!value) {
      setFilteredData(data)
      setSearchedData(data)
      setCustomData([])
      return
    }

    const currentFilteredData = filterDataByFields([...filteredData], filtersBy)
    const { matches } = findBestMatches(arrayData, value)

    const realMatches = matches?.filter((m) => {
      if (m.keywordMatches > 0) return true
    })
    const similarMatches = matches?.filter((m) => {
      if (m.matchBonus > 3) return true
    })

    const matchesItemData = realMatches
      ?.map((a) =>
        currentFilteredData.find((b) => b.id === a.item.split(' ')[0])
      )
      .filter((a) => a)
    const similarMatchesItemData = similarMatches
      ?.map((a) =>
        currentFilteredData.find((b) => b.id === a.item.split(' ')[0])
      )
      .filter((a) => a)
    if (matchesItemData.length > 0) {
      setFilteredData(matchesItemData)
      setSearchedData(matchesItemData)
    } else {
      setFilteredData(similarMatchesItemData)
      setSearchedData(similarMatchesItemData)
    }

    if (collectionSearch?.collectionName === 'orders') {
      const orders = await ServiceOrders.search({
        storeId,
        fields: collectionSearch?.fields,
        value,
        sections: permissions.canViewAllOrders
          ? 'all'
          : collectionSearch?.assignedSections
      }).then((res) => {
        return formatOrders({
          orders: res as Partial<OrderType>[],
          reports,
          customers
        })
      })

      setCustomData([...orders])
    }
    return
  }

  const filterDataByFields = (data: T[], filters: Filter[]) => {
    return data?.filter((order) => {
      return filters?.every((filter) => {
        return order?.[filter?.field] === filter?.value
      })
    })
  }

  const handleClearFilters = () => {
    setFilteredBy('')
    setFiltersBy([])
    setSearchValue('')
    setFilteredData([...data])
  }

  useEffect(() => {
    if (searchValue) {
      search(searchValue) // if is data, it will search again
    } else {
      // if not, it will filter the data
      const res = filterDataByFields(data, filtersBy)
      setFilteredData(res)
    }
  }, [data])

  const timeoutRef = useRef<number>()
  const [loading, setLoading] = useState(false)

  const searchDebounced = async (value: string) => {
    setLoading(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(async () => {
      await search(value)
      setLoading(false)
    }, debounceSearch)
  }
  return {
    filteredData,
    customData,
    filteredBy,
    handleClearFilters,
    filterBy,
    search: searchDebounced,
    filtersBy,
    searchValue,
    loading
  }
}
