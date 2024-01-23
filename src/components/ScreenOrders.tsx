import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import DATA, { Order } from '../DATA'

function ScreenOrders({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('NewOrder')}>
        <Text>Nueva Orden</Text>
      </Pressable>
      <FlatList
        style={styles.orderList}
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

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderList: {
    width: '100%'
  }
})

export default ScreenOrders
