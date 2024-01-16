import { FlatList, Pressable, Text, View } from 'react-native'
import DATA, { Order } from '../DATA'

function OrdersScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text>Go to Home</Text>
      </Pressable>
      <FlatList
        style={{ width: '100%' }}
        data={DATA.orders}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate('OrderDetails', { orderId: item.id })
            }}
          >
            <OrderItem order={item} />
          </Pressable>
        )}
      ></FlatList>
    </View>
  )
}

export const OrderItem = ({ order }: { order: Order }) => {
  return (
    <View style={{ marginVertical: 24 }}>
      <Text>Cliente: {order?.clientName} </Text>
      <Text>Ver</Text>
    </View>
  )
}

export default OrdersScreen
