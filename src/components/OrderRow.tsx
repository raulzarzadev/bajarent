import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { fromNow } from '../libs/utils-date'
import theme, { STATUS_COLOR } from '../theme'
import OrderStatus from './OrderStatus'

const OrderRow = ({ order }: { order: OrderType }) => {
  return (
    <View style={[styles.container]}>
      <Text style={[styles.folio, { textAlign: 'left', fontWeight: 'bold' }]}>
        {order.folio}
      </Text>
      <Text
        style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}
        numberOfLines={2}
      >
        {order.firstName} {order.lastName}
      </Text>
      {/* <Text style={styles.text}>{fromNow(order.createdAt)}</Text> */}
      <Text style={styles.text}>{order?.assignToPosition}</Text>
      <Text style={styles.text}>{fromNow(order.scheduledAt)}</Text>
      <Text style={styles.text}>
        <OrderStatus orderId={order.id} />
      </Text>
    </View>
  )
}

export default OrderRow

const styles = StyleSheet.create({
  folio: {
    width: '5%',
    textAlign: 'center',
    alignSelf: 'center'
  },
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
