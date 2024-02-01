import { useEffect, useState } from 'react'

export default function useFilter({ data } = { data: [] }) {
  useEffect(() => {
    setFilteredData(data)
  }, [data])
  const [filteredData, setFilteredData] = useState([])
  const [filteredBy, setFilteredBy] = useState<string | boolean>('status')
  const cleanFilter = () => {
    setFilteredBy('')
    setFilteredData(data)
  }
  const filterBy = (field = 'status', value: string | boolean) => {
    const res = [...data].filter((a) => {
      return a[field] === value
    })
    setFilteredBy(value)
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

  return { filteredData, filteredBy, cleanFilter, filterBy, search }
}
