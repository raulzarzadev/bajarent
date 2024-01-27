import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from './Button'

import { useStore } from '../contexts/storeContext'
import OrderRow from './OrderRow'
import { useAuth } from '../contexts/authContext'

function ScreenMyOrders({ navigation }) {
  const { orders, staff } = useStore()
  const { user } = useAuth()
  const myStaffId = staff.find((s) => s.userId === user.id)?.id
  const myOrders = orders.filter((order) => order.assignTo === myStaffId)

  return (
    <View style={styles.container}>
      <View style={{ padding: 4 }}>
        <Button onPress={() => navigation.push('NewOrder')}>Nueva orden</Button>
      </View>
      <FlatList
        style={styles.orderList}
        data={myOrders.map((order) => ({
          ...order,
          id: order.id,
          comments: []
        }))}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate('OrderDetails', { orderId: item.id })
            }}
          >
            <OrderRow order={item} />
          </Pressable>
        )}
      ></FlatList>
    </View>
  )
}

// export const Order = ({ order }: { order: OrderType }) => {
//   return (
//     <View style={{ marginVertical: 24 }}>
//       <Text>{order?.firstName} </Text>
//     </View>
//   )
// }

const styles = StyleSheet.create({
  container: {
    //padding: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderList: {
    width: '100%',
    // paddingVertical: 40,
    paddingHorizontal: 4
  }
})

export default ScreenMyOrders
