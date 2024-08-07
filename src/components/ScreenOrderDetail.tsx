import { View, ScrollView, ActivityIndicator } from 'react-native'
import OrderDetails from './OrderDetails'
import { useEffect, useState } from 'react'
import { listenFullOrderData } from '../contexts/libs/getFullOrderData'
import OrderType from '../types/OrderType'
import ErrorBoundary from './ErrorBoundary'
import { OrderContext } from '../contexts/orderContext'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route?.params
  const [order, setOrder] = useState<OrderType>()
  useEffect(() => {
    if (orderId) {
      listenFullOrderData(orderId, (order) => {
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
    <ScrollView>
      <View
        style={{
          maxWidth: 500,
          width: '100%',
          marginHorizontal: 'auto',
          marginTop: 12
        }}
      >
        <OrderContext.Provider value={{ order, setOrder }}>
          <OrderDetails order={order} />
        </OrderContext.Provider>
      </View>
    </ScrollView>
  )
}

export const ScreenOrderDetailE = (props) => (
  <ErrorBoundary componentName="ScreenOrderDetail">
    <ScreenOrderDetail {...props} />
  </ErrorBoundary>
)

export default ScreenOrderDetail
