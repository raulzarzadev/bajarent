import { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import { useOrdersCtx } from '../contexts/ordersContext'
import asDate from '../libs/utils-date'
import OrderType from '../types/OrderType'
import { useStore } from '../contexts/storeContext'

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
  const search = async (value: string) => {
    setSearchValue(value)
    setTimeout(async () => {
      const filteredData = filterDataByFields(data, filtersBy) // <-- Apply filters and search in current selection
      // let exactMatches = []
      if (!value) {
        //<-- Apply filters if exist to keep current selection
        setFilteredData(filteredData)
        setCustomData([])

        return
      }

      const res = filteredData?.filter((order) => {
        //* Get all values of the order
        const orderValues = Object.values(order)

        //*  Check for exact matches first and add to exactMatches
        // orderValues.forEach((orderValue) => {
        //   if (orderValue == value) {
        //     exactMatches.push(order)
        //   }

        // })
        //*  Check for partial matches and add to filteredData
        return orderValues.some((orderValue) => {
          if (typeof orderValue === 'string') {
            return orderValue.toLowerCase().includes(value.toLowerCase())
          }
          if (typeof orderValue === 'number' && !isNaN(Number(value))) {
            return orderValue === parseFloat(value)
          }
          return false
        })
      })

      if (collectionSearch?.collectionName === 'orders') {
        // const avoidIds = res.map(({ id }) => id)
        const orders = await ServiceOrders.search({
          storeId,
          fields: collectionSearch?.fields,
          value,
          sections: collectionSearch?.assignedSections
        }).then((res) => {
          return formatOrders({ orders: res as Partial<OrderType>[], reports })
        })

        setCustomData([
          ...orders.filter((o) => !res.some((r) => r.id === o.id))
        ])
      }
      //console.log({ exactMatches })

      setFilteredData(res)
      // if (exactMatches.length > 0) {
      //   setFilteredData(exactMatches)
      // } else {
      // }
    }, debounceSearch)
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

  return {
    filteredData,
    customData,
    filteredBy,
    handleClearFilters,
    filterByDates,
    filterBy,
    search,
    filtersBy,
    searchValue
  }
}
