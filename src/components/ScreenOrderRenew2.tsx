import { ActivityIndicator, Text, View } from 'react-native'
import OrderType from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/authContext'
import { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { getFullOrderData } from '../contexts/libs/getFullOrderData'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import FormOrderRenew from './FormOrderRenew'

const ScreenOrderRenew = ({ route }) => {
  const orderId = route?.params?.orderId
  const { navigate } = useNavigation()
  const { user } = useAuth()
  const { categories } = useStore()
  const [order, setOrder] = useState<OrderType | null>(null)
  useEffect(() => {
    getFullOrderData(orderId).then((order) => setOrder(order))
  }, [])
  if (!order) return <ActivityIndicator />

  return (
    <View style={gStyles.container}>
      <Text>
        Renovación de {order.folio} {order.note ? `-${order.note}` : ''}
      </Text>
      <Text>{order.fullName}</Text>
      <FormOrderRenew order={order} />
    </View>
  )
}

export const ScreenOrderRenewE = (props) => (
  <ErrorBoundary componentName="ScreenOrderRenew">
    <ScreenOrderRenew {...props} />
  </ErrorBoundary>
)

export default ScreenOrderRenew
