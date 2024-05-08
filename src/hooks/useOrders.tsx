import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'

export default function useOrders({ ids }: { ids: string[] }) {
  const [orders, setOrders] = useState<OrderType[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await ServiceOrders.getList(ids).then((res) => setOrders(res))
      } catch (e) {
        console.error({ e })
      }
    }
    fetchOrders()
  }, [ids])

  return {
    orders
  }
}
