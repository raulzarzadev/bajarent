import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { formatOrders } from '../libs/orders'
import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'

export default function useOrders({ ids = [] }: { ids: string[] }) {
  const [orders, setOrders] = useState<OrderType[]>([])
  const { storeId } = useAuth()
  useEffect(() => {
    if (ids.length === 0) return
    fetchOrders()
  }, [ids, storeId])
  const fetchOrders = async () => {
    try {
      const reports = await ServiceComments.getReportsUnsolved(storeId)
      const promises = ids?.map(async (id) => {
        const order = await ServiceOrders.get(id)
        return order
      })
      const res = await Promise.all(promises)
      const formattedOrders = formatOrders({ orders: res, reports })
      setOrders(formattedOrders)
    } catch (e) {
      console.error({ e })
    }
  }

  return {
    orders,
    fetchOrders
  }
}
