import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { dateFormat, fromNow } from '../libs/utils-date'
import theme, { STATUS_COLOR } from '../theme'
import { OrderDirectives } from './OrderDetails'

const OrderRow = ({ order }: { order: OrderType }) => {
  return (
    <View style={[styles.container]}>
      <View style={{ alignSelf: 'center', width: '25%' }}>
        <Text style={{ textAlign: 'center' }} numberOfLines={1}>
          {order.folio}
        </Text>
        <Text style={{ textAlign: 'center' }} numberOfLines={2}>
          {order.firstName} {order.lastName}
        </Text>
      </View>
      <View style={{ width: 85, alignSelf: 'center' }}>
        <Text style={[{ textAlign: 'center' }]}>
          {dateFormat(order.scheduledAt, 'dd-MMM-yy')}
        </Text>
        <Text style={[{ textAlign: 'center' }]}>
          {fromNow(order.scheduledAt)}
        </Text>
      </View>
      <View style={{ width: '60%', justifyContent: 'flex-start' }}>
        <OrderDirectives order={order} />
      </View>
      {/* <Text style={styles.text}>{fromNow(order.createdAt)}</Text> */}

      {/* <View>
        <OrderAssignedTo orderId={order.id} />
      </View>
      <View style={{}}>
        <Text style={[{ textAlign: 'center' }]}>
          {dateFormat(order.scheduledAt, 'dd-MMM-yy')}
        </Text>
        <Text style={[{ textAlign: 'center' }]}>
          {fromNow(order.scheduledAt)}
        </Text>
      </View>
      <Text>
        <OrderStatus orderId={order.id} />
      </Text> */}
    </View>
  )
}

export default OrderRow

const styles = StyleSheet.create({
  //
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
