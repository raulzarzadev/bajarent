import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'

function ScreenOrders({ navigation, route }) {
  const { orders } = useStore()
  const [filtered, setFiltered] = useState<string[]>([])
  const filter = route?.params?.orders || []

  useEffect(() => {
    if (filter.length > 0)
      setFiltered(
        orders.filter((o) => filter.includes(o.id)).map((o) => o.id) || []
      )
  }, [filter])

  return <ListOrders orders={orders} defaultOrdersIds={filtered} />
}

export default ScreenOrders
