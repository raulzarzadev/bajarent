import { View, ScrollView, ActivityIndicator } from 'react-native'
import OrderDetails from './OrderDetails'
import { useStore } from '../contexts/storeContext'

const ScreenOrderDetail = ({ route, navigation }) => {
  const { orderId } = route?.params
  const { orders } = useStore()
  const order = orders?.find((order) => order?.id === orderId)
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
