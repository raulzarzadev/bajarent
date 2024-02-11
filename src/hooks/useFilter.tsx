import { useEffect, useState } from 'react'

export default function useFilter<T>({ data = [] }: { data: T[] }) {
  useEffect(() => {
    setFilteredData(data)
  }, [])
  const [filteredData, setFilteredData] = useState<T[]>([])
  const [filteredBy, setFilteredBy] = useState<string | boolean | number>(
    'status'
  )
  const [filtersBy, setFiltersBy] = useState<
    { field: string; value: string | number | boolean }[]
  >([])
  const cleanFilter = () => {
    setFilteredBy('')
    setFilteredData(data)
    setFiltersBy([])
  }

  const filterBy = (field = 'status', value: string | boolean | number) => {
    let filters = [...filtersBy]
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
      const res = [...data].filter((order) => {
        return filters.every((filter) => {
          return order[filter.field] === filter.value
        })
      })
      setFilteredData(res)
      return
    }

    //* If a similar filter exist, replace it
    if (similarExist) {
      const cleanFilter = [...filters].filter((a) => !(a.field === field))
      filters = [...cleanFilter, { field, value }]
      setFiltersBy(filters)
      const res = [...data].filter((order) => {
        return filters.every((filter) => {
          return order[filter.field] === filter.value
        })
      })
      setFilteredData(res)
      return
    }

    //* if similar or same fails add it
    filters = [...filtersBy, { field, value }]
    setFiltersBy(filters)
    const res = [...data].filter((order) => {
      return filters.every((filter) => {
        return order[filter.field] === filter.value
      })
    })
    setFilteredData(res)
  }

  const search = (value: string) => {
    const res = [...data].filter((a) => {
      return Object.values(a).some((b) => {
        if (typeof b === 'string') {
          return b.toLowerCase().includes(value.toLowerCase())
        }
        return false
      })
    })
    setFilteredData(res)
  }

  return { filteredData, filteredBy, cleanFilter, filterBy, search, filtersBy }
}
