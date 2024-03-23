import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'

export default function useOrders({ storeId }: { storeId: string }) {
  const [orders, setOrders] = useState<OrderType[]>([])

  const handleGetSolvedOrders = () => {
    ServiceOrders.getSolved(storeId).then((res) => {
      setOrders((prev) => [...prev, ...res])
    })
  }

  useEffect(() => {
    ServiceOrders.listenUnsolved(storeId, setOrders)
  }, [storeId])

  return {
    orders,
    handleGetSolvedOrders
  }
}
