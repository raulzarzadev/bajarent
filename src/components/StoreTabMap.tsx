import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useOrdersCtx } from '../contexts/ordersContext'
import { order_status } from '../types/OrderType'
import { type MapOrderType, OrdersMapE } from './OrdersMap'

const StoreTabMap = () => {
  const [orders, setOrders] = useState<MapOrderType[]>([])
  const { orders: consolidated } = useOrdersCtx()
  useEffect(() => {
    const formatted = consolidated
      ?.filter((order) => {
        //if has location
        //if is delivered
        //if is a rent
        if (
          order.location &&
          order.type === 'RENT' &&
          order.status === order_status.DELIVERED
        )
          return true
        return false
      })
      // Filter only orders with coords
      ?.filter((order) => !!order?.coords)
      // Format the orders
      ?.map((order) => {
        const formatOrder: MapOrderType = {
          fullName: order.fullName,
          coords: order.coords,
          orderId: order.id,
          orderFolio: order.folio,
          itemNumber: order.items[0].number,
          itemId: order.items[0].id,
          status: order.status,
          type: order.type
        }
        return formatOrder
      })
    setOrders(formatted)
  }, [consolidated])
  return (
    <View>
      <OrdersMapE orders={orders} />
    </View>
  )
}

export default StoreTabMap
