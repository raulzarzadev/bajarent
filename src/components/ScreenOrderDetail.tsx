import { View, ScrollView, ActivityIndicator } from 'react-native'
import OrderDetails from './OrderDetails'
import OrderType from '../types/OrderType'
import { useEffect, useState } from 'react'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route?.params

  const [order, setOrder] = useState<OrderType>()
  useEffect(() => {
    if (orderId) {
      getFullOrderData(orderId).then((order) => {
        setOrder(order)
      })
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
        <OrderDetails order={order} />
      </View>
    </ScrollView>
  )
}

export default ScreenOrderDetail
