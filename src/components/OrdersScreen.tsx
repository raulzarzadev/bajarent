import { FlatList, Pressable, Text, View } from 'react-native'
import OrdersList from './Orders'
import DATA from '../DATA'

function OrdersScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text>Go to Home</Text>
      </Pressable>
      <FlatList
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

export const OrderItem = ({ order }) => {
  return (
    <View>
      <Text>Cliente: {order?.client?.name} </Text>
      <Text>Ver</Text>
    </View>
  )
}

export default OrdersScreen
