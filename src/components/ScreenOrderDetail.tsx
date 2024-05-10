import { View, ScrollView, ActivityIndicator } from 'react-native'
import OrderDetails from './OrderDetails'
import { useOrdersCtx } from '../contexts/ordersContext'
import { useEffect, useState } from 'react'
import { listenFullOrderData } from '../contexts/libs/getFullOrderData'
import OrderType from '../types/OrderType'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route?.params
  const { orders } = useOrdersCtx()
  const orderCtx = orders.find((order) => order.id === orderId)
  const [order, setOrder] = useState<OrderType>()
  useEffect(() => {
    if (orderId) {
      listenFullOrderData(orderId, (order) => setOrder(order))
    }
  }, [orderId])

  if (!order) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    <ScrollView style={{}}>
      <View
        style={{
          maxWidth: 500,
          width: '100%',
          marginHorizontal: 'auto',
          marginTop: 12
        }}
      >
        <OrderDetails order={order || orderCtx} />
      </View>
    </ScrollView>
  )
}

export default ScreenOrderDetail
