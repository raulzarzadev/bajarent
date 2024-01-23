import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from './Button'
import OrderType from '../types/OrderType'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderRow from './OrderRow'

import { NavigationProp } from '@react-navigation/native'

function ScreenOrders({ navigation }) {
  const { storeId } = useStore()
  const [orders, setOrders] = useState<OrderType[]>([])

  useEffect(() => {
    if (storeId) ServiceOrders.storeOrders(storeId, setOrders)
  }, [storeId])

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.push('NewOrder')}>Nueva orden</Button>
      <FlatList
        style={styles.orderList}
        data={orders}
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
