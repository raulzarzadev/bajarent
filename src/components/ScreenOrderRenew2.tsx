import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import OrderType from '../types/OrderType'
import { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { gStyles } from '../styles'
import FormOrderRenew from './FormOrderRenew'

const ScreenOrderRenew = ({ route }) => {
  const orderId = route?.params?.orderId
  const [order, setOrder] = useState<OrderType | null>(null)
  useEffect(() => {
    getFullOrderData(orderId).then((order) => setOrder(order))
  }, [])
  if (!order) return <ActivityIndicator />

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <Text>
          Renovación de {order.folio} {order.note ? `-${order.note}` : ''}
        </Text>
        <Text>{order.fullName}</Text>
        <FormOrderRenew order={order} />
      </View>
    </ScrollView>
  )
}

export const ScreenOrderRenewE = (props) => (
  <ErrorBoundary componentName="ScreenOrderRenew">
    <ScreenOrderRenew {...props} />
  </ErrorBoundary>
)

export default ScreenOrderRenew
