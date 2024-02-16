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
  }, [data])

  const sortBy = (field = defaultSortBy) => {
    const res = [...data].sort((a, b) => {
      const statusIsNotIn = (statuses: string[]) => {
        // @ts-ignore
        return !statuses.includes(a?.status) || !statuses.includes(b?.status)
      }
      if (
        // @ts-ignore
        a?.priority &&
        // @ts-ignore
        b?.priority &&
        statusIsNotIn([
          order_status.CANCELLED,
          order_status.DELIVERED,
          order_status.PICKUP,
          order_status.REPAIR_DELIVERED,
          order_status.RENEWED
        ])
      ) {
        // @ts-ignore
        if (a?.priority < b?.priority) return -1
        // @ts-ignore
        if (a?.priority > b?.priority) return 1
        return 0
      }
      let aField = a[field] || ''
      let bField = b[field] || ''

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

    // Cambiar el orden para la próxima vez que se llame a la función
    setOrder(order === 'asc' ? 'des' : 'asc')
    setSortedBy(field)
    setSortedData(res)
  }

  return { sortedData, sortedBy, order, sortBy }
}
