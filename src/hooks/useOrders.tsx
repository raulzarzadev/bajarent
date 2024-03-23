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
    //* FIXME: This is generating problems because orders with reports or expired status are not getting
    // ServiceOrders.listenUnsolved(storeId, setOrders)
    ServiceOrders.listenByStore(storeId, setOrders)
  }, [storeId])

  useEffect(() => {
    //* We should listen unsolved orders, expired and reported orders.
  }, [orders])

  return {
    orders,
    handleGetSolvedOrders
  }
}
