import { useEffect, useState } from 'react'
import { CollectionSearch } from '../components/ModalFilterList'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import { useOrdersCtx } from '../contexts/ordersContext'

export type Filter = { field: string; value: string | number | boolean }

export default function useFilter<T extends { id?: string }>({
  data = [],
  collectionSearch
}: {
  data: T[]
  collectionSearch?: CollectionSearch
}) {
  const { reports } = useOrdersCtx()
  const [filteredData, setFilteredData] = useState<T[]>([])
  const [filteredBy, setFilteredBy] = useState<string | boolean | number>(
    'status'
  )
  const [filtersBy, setFiltersBy] = useState<Filter[]>([])
  const cleanFilter = () => {
    setFilteredBy('')
    setFilteredData(data)
    setFiltersBy([])
    search('')
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
      const cleanFilter = [...filters].filter(
        (a) => !(a.field === field && a.value === value)
      )
      filters = cleanFilter
      setFiltersBy(filters)
      const res = filterDataByFields(data, filters)
      setFilteredData(res)
      return
    }

    //* If a similar filter exist, replace it
    if (similarExist) {
      const cleanFilter = [...filters].filter((a) => !(a.field === field))
      filters = [...cleanFilter, { field, value }]
      setFiltersBy(filters)
      const res = filterDataByFields(data, filters)
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

    if (!value) {
      //<-- Apply filters if exist to keep current selection
      const res = filterDataByFields(data, filtersBy)
      setFilteredData(res)
      return
    }

    const res = [...data].filter((order) => {
      return Object.values(order).some((val) => {
        if (typeof val === 'string') {
          return val.toLowerCase().includes(value.toLowerCase())
        }
        if (typeof val === 'number' && !isNaN(Number(value))) {
          return val === parseFloat(value)
        }

        return false
      })
    })

    if (collectionSearch?.collectionName === 'orders') {
      const avoidIds = res.map(({ id }) => id)
      const orders = await ServiceOrders.search(
        collectionSearch?.fields,
        value,
        avoidIds
      ).then((res) => {
        return formatOrders({ orders: res, reports })
      })
      setFilteredData([...orders, ...res])
    } else {
      setFilteredData([...res])
    }

    // console.log({ res })
    // if (collectionSearch?.collectionName === 'orders') {
    //   ServiceOrders.search(
    //     collectionSearch?.fields,
    //     value,
    //     res.map(({ id }) => id)
    //   ).then((res) => {
    //     const orders = formatOrders({ orders: res, reports })
    //     setFilteredData([...res, ...orders])
    //   })
    // } else {
    //   setFilteredData(res)
    // }
  }

  useEffect(() => {
    search(searchValue)
  }, [data])

  const filterDataByFields = (data: T[], filters: Filter[]) => {
    return data.filter((order) => {
      return filters.every((filter) => {
        return order[filter.field] === filter.value
      })
    })
  }

  return { filteredData, filteredBy, cleanFilter, filterBy, search, filtersBy }
}
