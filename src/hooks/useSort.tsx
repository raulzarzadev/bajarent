import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { order_status } from '../types/OrderType'

export default function useSort<T>({
  data,
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
      let aField = a[field] || ''
      let bField = b[field] || ''

      const statusAreIn = () => {
        const omitSortPriorityStatus = [
          order_status.RENEWED,
          order_status.DELIVERED,
          order_status.REPAIR_DELIVERED,
          order_status.CANCELLED,
          order_status.PICKUP
        ]
        return (
          // @ts-ignore
          omitSortPriorityStatus.includes(a?.status) &&
          // @ts-ignore
          omitSortPriorityStatus.includes(b?.status)
        )
      }

      // if field is "priority" and omit if status of the order renewed, canceled, delivered, repair delivered
      if (field === 'priority' && !statusAreIn()) {
        //* add a default value to put the orders without priority at the end
        aField = parseInt(`${aField}` || '9999')
        bField = parseInt(`${bField}` || '9999')
        //* orders
        if (aField < bField) return order === 'asc' ? -1 : 1
        if (aField > bField) return order === 'asc' ? 1 : -1
        return 0
      }

      // if field is a Date or Timestamp, convert it to a number
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
