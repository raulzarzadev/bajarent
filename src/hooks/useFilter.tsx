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
  const { reports } = useOrdersCtx()
  const [filteredData, setFilteredData] = useState<T[]>([...data])
  const [filteredBy, setFilteredBy] = useState<string | boolean | number>(
    'status'
  )
  const { data: customers } = useCustomers()
  const [customData, setCustomData] = useState<T[]>([])
  const [filtersBy, setFiltersBy] = useState<Filter[]>([])

  const filterByDates = (
    field: string,
    dates: { fromDate: Date; toDate: Date }
  ) => {
    console.log({ field, dates })
    const res = [...data].filter((o) => {
      const orderTime = asDate(o?.[field])?.getTime()
      const fromTime = asDate(dates?.fromDate)?.getTime()
      const toTime = asDate(dates?.toDate)?.getTime()
      return orderTime >= fromTime && orderTime <= toTime
    })
    handleClearFilters()
    setFiltersBy([{ field: 'dates', value: 'Custom Filter' }])
    setFilteredData(res)
  }

  const filterBy = (
    field = 'status',
    value: string | boolean | number | string[]
  ) => {
    let filters = [...filtersBy]

    //* CUSTOM FILTERS SHOULD PROVIDE AN ARRAY OF STRINGS (IDS )
    if (field === 'customIds' && Array.isArray(value)) {
      filters = filters.filter((a) => a.field !== field)
      setFiltersBy([{ field: 'customIds', value: 'Custom Filter' }])
      const res = [...data].filter((order) => {
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
      const res = filterDataByFields(data, filters)
      setFilteredData(res)
      return
    }

    //* If a similar filter exist, replace it
    if (similarExist) {
      const cleanedFilters = [...filters].filter((a) => !(a.field === field))
      filters = [...cleanedFilters, { field, value }]
      setFiltersBy(filters)
      const res = filterDataByFields(data, filters)
      setFilteredData(res)
      return
    }
    const isFilteredByDates = filtersBy.some((a) => a.field === 'dates')
    if (isFilteredByDates) {
      console.log({ isFilteredByDates })
      filters = [...filtersBy, { field, value }]
      const res = filterDataByFields(
        filteredData,
        filters?.filter((a) => a.field !== 'dates')
      )
      setFilteredData(res)
      return
    }

    //* if similar or same fails add it
    filters = [...filtersBy, { field, value }]
    setFiltersBy(filters)
    const res = filterDataByFields(data, filters)
    setFilteredData(res)
  }

  const [searchValue, setSearchValue] = useState('')
  const arrayData = data.map((a) => {
    return processData(a)
  })
  const search = async (value: string) => {
    setSearchValue(value)

    if (!value) {
      setFilteredData([...data])
      setCustomData([])
      return
    }
    const LIMIT_SEARCH_RESULTS = 10
    const { matches } = findBestMatches(arrayData, value, LIMIT_SEARCH_RESULTS)

    const filteredData = filterDataByFields(data, filtersBy)

    const matchesIds = matches?.map((a) => ({
      ...a,
      itemId: a.item.split(' ')[0],
      itemData: filteredData.find((b) => b.id === a.item.split(' ')[0])
    }))

    // const exactMatches = matchesIds.filter((m) => m.keywordMatches > 0)[0]
    // const maxMatchBonus = matchesIds.sort(
    //   (a, b) => b.matchBonus - a.matchBonus
    // )[0]
    // const minDistance = matchesIds.sort((a, b) => a.distance - b.distance)[0]
    // console.log({ matchesIds })
    setFilteredData(matchesIds.map((a) => a.itemData))
    // if (exactMatches) {
    //   setFilteredData([exactMatches.itemData])
    // } else if (maxMatchBonus) {
    //   setFilteredData([maxMatchBonus.itemData])
    // } else if (minDistance) {
    //   setFilteredData([minDistance.itemData])
    // } else {
    // }

    if (collectionSearch?.collectionName === 'orders') {
      console.log('custmom')
      const orders = await ServiceOrders.search({
        storeId,
        fields: collectionSearch?.fields,
        value,
        sections: collectionSearch?.assignedSections
      }).then((res) => {
        return formatOrders({
          orders: res as Partial<OrderType>[],
          reports,
          customers
        })
      })
      console.log({ orders })

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
    setFilteredData([...data])
    setFilteredBy('')
    setFiltersBy([])
    setSearchValue('')
  }

  useEffect(() => {
    search(searchValue)
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
    filterByDates,
    filterBy,
    search: searchDebounced,
    filtersBy,
    searchValue,
    loading
  }
}
