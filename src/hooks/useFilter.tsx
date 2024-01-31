import { useEffect, useState } from 'react'

export default function useFilter({ data } = { data: [] }) {
  useEffect(() => {
    setFilteredData(data)
  }, [data])
  const [filteredData, setFilteredData] = useState([])
  const [filteredBy, setFilteredBy] = useState('status')
  const cleanFilter = () => {
    setFilteredBy('')
    setFilteredData(data)
  }
  const filterBy = (field = 'status', value = '') => {
    const res = [...data].filter((a) => {
      return a[field] === value
    })
    setFilteredBy(value)
    setFilteredData(res)
  }

  return { filteredData, filteredBy, cleanFilter, filterBy }
}
