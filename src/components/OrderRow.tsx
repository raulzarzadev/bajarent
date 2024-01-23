import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { fromNow } from '../libs/utils-date'
import dictionary from '../dictionary'
import statusColors from '../libs/statusColor'

const OrderRow = ({ order }: { order: OrderType }) => {
  const orderStatus = order.status || 'PENDING'
  const statusColor = statusColors[orderStatus]

  return (
    <View style={[styles.container, { backgroundColor: statusColor }]}>
      <Text>{order.firstName}</Text>
      <Text>{dictionary(orderStatus)}</Text>
      <Text>{fromNow(order.createdAt)}</Text>
    </View>
  )
}

export default OrderRow

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
