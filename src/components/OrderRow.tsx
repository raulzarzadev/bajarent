import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { dateFormat, fromNow } from '../libs/utils-date'
import theme, { STATUS_COLOR } from '../theme'
import OrderStatus from './OrderStatus'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import OrderAssignedTo from './OrderAssignedTo'

const OrderRow = ({ order }: { order: OrderType }) => {
  const { storeSections, staff } = useStore()
  const assignToStaff = staff.find(
    ({ id }) => order.assignToPosition === id
  )?.name
  const assignToSection = storeSections.find(
    ({ id }) => order.assignToSection === id
  )?.name
  return (
    <View style={[styles.container]}>
      <Text
        style={[
          styles.folio,
          { textAlign: 'left', fontWeight: 'bold', width: 60 }
        ]}
        numberOfLines={1}
      >
        {order.folio}
      </Text>
      <Text style={[styles.text, { textAlign: 'left' }]} numberOfLines={2}>
        {order.firstName} {order.lastName}
      </Text>
      {/* <Text style={styles.text}>{fromNow(order.createdAt)}</Text> */}
      <View style={[styles.text]}>
        <OrderAssignedTo orderId={order.id} />
      </View>
      <View style={[styles.text]}>
        <Text style={[{ textAlign: 'center' }]}>
          {dateFormat(order.scheduledAt, 'dd-MMM-yy')}
        </Text>
        <Text style={[{ textAlign: 'center' }]}>
          {fromNow(order.scheduledAt)}
        </Text>
      </View>
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
