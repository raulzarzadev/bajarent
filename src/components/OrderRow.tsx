import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType, { OrderStatus } from '../types/OrderType'
import { fromNow } from '../libs/utils-date'
import dictionary from '../dictionary'
import orderStatus from '../libs/orderStatus'
import useTheme from '../hooks/useTheme'
import { STATUS_COLOR } from '../theme'

const OrderRow = ({ order }: { order: OrderType }) => {
  const status = orderStatus(order)
  return (
    <View style={[styles.container, { backgroundColor: STATUS_COLOR[status] }]}>
      <Text style={[styles.text, { textAlign: 'left', fontWeight: 'bold' }]}>
        {order.firstName}
      </Text>
      <Text style={styles.text}>{fromNow(order.createdAt)}</Text>
      <Text style={styles.text}>
        {dictionary(orderStatus(order)).toUpperCase()}
      </Text>
      {/* <Button onPress={() => {}} size="xs">
        {orderStatus(order)}
      </Button> */}
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
    borderColor: 'transparent'
  }
})
