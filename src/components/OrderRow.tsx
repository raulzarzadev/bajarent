import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { fromNow } from '../libs/utils-date'
import theme, { STATUS_COLOR } from '../theme'
import OrderStatus from './OrderStatus'

const OrderRow = ({ order }: { order: OrderType }) => {
  return (
    <View style={[styles.container]}>
      <Text style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}>
        {order.firstName}
      </Text>
      <Text style={styles.text}>{fromNow(order.createdAt)}</Text>
      <Text style={styles.text}>{fromNow(order.scheduledAt)}</Text>
      <Text style={styles.text}>
        <OrderStatus orderId={order.id} />
      </Text>
    </View>
  )
}

export default OrderRow

const styles = StyleSheet.create({
  text: {
    width: '33%',
    textAlign: 'center',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.neutral,
    backgroundColor: STATUS_COLOR.PENDING
  }
})
