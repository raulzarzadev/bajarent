import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import P from './P'

const OrderStatus = ({
  status = 'PENDING'
}: {
  status: OrderType['status']
}) => {
  const color = STATUS_COLOR[status]
  return (
    <View
      style={{
        padding: 6,
        backgroundColor: color,
        borderRadius: 4,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: color
      }}
    >
      <P
        styles={{
          fontWeight: 'bold'
          // color: status === 'PENDING' ? theme.colors.black : theme.colors.white
        }}
      >
        {dictionary(status || 'PENDING').toUpperCase()}
      </P>
    </View>
  )
}

export default OrderStatus

const styles = StyleSheet.create({})
