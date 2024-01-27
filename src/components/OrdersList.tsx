import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import OrderRow from './OrderRow'
import { useState } from 'react'
import OrderType from '../types/OrderType'

function OrdersList({
  orders,
  onPressRow
}: {
  orders: OrderType[]
  onPressRow?: (orderId: string) => void
}) {
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
    { key: 'folio', label: 'Folio' },
    { key: 'firstName', label: 'Nombre' },
    //{ key: 'lastName', label: 'Apellido' },
    { key: 'createdAt', label: 'Creada' },
    { key: 'scheduledAt', label: 'Programada' },
    { key: 'status', label: 'Estado' }
  ]
  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%'
        }}
      >
        {sortFields.map((field) => (
          <Pressable
            onPress={() => {
              sortBy(field.key)
            }}
          >
            <Text
              style={{
                fontWeight: orderSortedBy === field.key ? 'bold' : 'normal'
              }}
            >
              {field.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        style={styles.orderList}
        data={ordersSorted}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              onPressRow && onPressRow(item.id)
            }}
          >
            <OrderRow order={item} />
          </Pressable>
        )}
      ></FlatList>
    </View>
  )
}

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

export default OrdersList
