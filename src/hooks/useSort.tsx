import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function useSort({ data } = { data: [] }) {
  useEffect(() => {
    setSortedData(data)
  }, [data])
  const [sortedData, setSortedData] = useState([])
  const [sortedBy, setSortedBy] = useState('status')
  const [order, setOrder] = useState<'asc' | 'des'>('asc')

  const sortBy = (field = 'status') => {
    const res = [...data].sort((a, b) => {
      let aField = a[field] || ''
      let bField = b[field] || ''
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
