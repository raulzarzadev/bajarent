import { View, Text } from 'react-native'

const ScreenOrderDetail = ({ route }) => {
  const { orderId } = route.params
  return (
    <View>
      <Text>Orden Id: {orderId}</Text>
    </View>
  )
}

export default ScreenOrderDetail
