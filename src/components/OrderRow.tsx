import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { fromNow } from '../libs/utils-date'
import dictionary from '../dictionary'
import theme from '../theme'
import orderStatus from '../libs/orderStatus'

const OrderRow = ({ order }: { order: OrderType }) => {
  const status = orderStatus(order)
  const color = theme.statusColor[status]

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}>
        {order.firstName}
      </Text>
      <Text style={styles.text}>{dictionary(status).toUpperCase()}</Text>
      <Text style={styles.text}>{fromNow(order.createdAt)}</Text>
    </View>
  )
}

export default OrderRow

const styles = StyleSheet.create({
  text: {
    width: '33%',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: theme.colors.disabled,
    borderWidth: 1
  }
})
