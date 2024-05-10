import { useEffect, useState } from 'react'
import OrderType from '../types/OrderType'
import { ServiceOrders } from '../firebase/ServiceOrders'

export default function useOrders({ ids = [] }: { ids: string[] }) {
  const [orders, setOrders] = useState<OrderType[]>([])

  useEffect(() => {
    console.log('first')
    if (ids.length === 0) return

    const fetchOrders = async () => {
      try {
        // await ServiceOrders.getList(ids).then((res) => setOrders(res))
        const promises = ids?.map(async (id) => {
          const order = await ServiceOrders.get(id)
          return order
        })
        const res = await Promise.all(promises)
        setOrders(res)
      } catch (e) {
        console.error({ e })
      }
    }
    console.log('first')
    fetchOrders()
  }, [ids])

  return {
    orders
  }
}
