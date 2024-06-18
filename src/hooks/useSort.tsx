import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { order_status } from '../types/OrderType'

export default function useSort<T>({
  data = [],
  defaultSortBy = '',
  defaultOrder = 'asc'
}: {
  data: T[]
  defaultSortBy: string
  defaultOrder?: 'asc' | 'des'
}) {
  const [sortedData, setSortedData] = useState<T[]>([])
  const [sortedBy, setSortedBy] = useState(defaultSortBy)
  const [order, setOrder] = useState<'asc' | 'des'>(defaultOrder)

  useEffect(() => {
    sortBy(defaultSortBy)
  }, [])

  useEffect(() => {
    setSortedData(sortData(defaultSortBy, data, defaultOrder))
  }, [data])

  const sortData = (field: string, data: T[], order?: 'asc' | 'des') => {
    const res = [...data].sort((a, b) => {
      let aField = a?.[field] || ''
      let bField = b?.[field] || ''

      if (aField instanceof Date && aField instanceof Timestamp) {
        aField = aField.toDate().getTime()
        bField = bField.toDate().getTime()
      }

      const isAscending = order === 'asc'
      if (aField < bField) return isAscending ? -1 : 1
      if (aField > bField) return isAscending ? 1 : -1
      return 0
    })
    return res
  }

  const sortBy = (field = defaultSortBy) => {
    const res = sortData(field, data, order)
    setSortedBy(field)
    setSortedData(res)
  }
  const changeOrder = () => {
    setOrder(order === 'asc' ? 'des' : 'asc')
  }

  return { sortedData, sortedBy, order, sortBy, changeOrder }
}
