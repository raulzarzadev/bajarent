import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from './Button'

import { useStore } from '../contexts/storeContext'
import OrderRow from './OrderRow'
import { useState } from 'react'
import { set } from 'date-fns'
import OrdersList from './OrdersList'

function ScreenOrders({ navigation }) {
  const { orders } = useStore()

  const [ordersSorted, setOrdersSorted] = useState(orders)
  const [orderSortedBy, setOrderSortedBy] = useState('status')
  const sortBy = (field = 'status') => {
    const res = orders.sort((a, b) => {
      if (a[field] < b[field]) {
        return 1
      }
      if (a[field] > b[field]) {
        return -1
      }
      return 0
    })
    setOrderSortedBy(field)
    setOrdersSorted(res)
  }
  const sortFields = [
    { key: 'firstName', label: 'Nombre' },
    //{ key: 'lastName', label: 'Apellido' },
    { key: 'createdAt', label: 'Creada' },
    { key: 'scheduledAt', label: 'Programada' },
    { key: 'status', label: 'Estado' }
  ]
  return (
    <>
      <View
        style={{
          padding: 4,
          width: 150,
          justifyContent: 'center',
          margin: 'auto'
        }}
      >
        <Button onPress={() => navigation.push('NewOrder')}>Nueva orden</Button>
      </View>
      <OrdersList
        orders={orders}
        onPressRow={(itemId) => {
          navigation.navigate('OrderDetails', { orderId: itemId })
        }}
      />
    </>
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

export default ScreenOrders
