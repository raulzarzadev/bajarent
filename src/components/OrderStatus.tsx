import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import theme from '../theme'
import dictionary from '../dictionary'
import P from './P'

const OrderStatus = ({
  status = 'PENDING'
}: {
  status: OrderType['status']
}) => {
  const color = theme.statusColor[status]
  return (
    <View
      style={{
        padding: theme.padding.sm,
        backgroundColor: color,
        borderRadius: theme.borderRadius.sm,
        marginVertical: theme.margin.md,
        borderWidth: 1,
        borderColor: theme.colors.disabled
      }}
    >
      <P
        styles={{
          fontWeight: 'bold',
          color: status === 'PENDING' ? theme.colors.black : theme.colors.white
        }}
      >
        {dictionary(status || 'PENDING').toUpperCase()}
      </P>
    </View>
  )
}

export default OrderStatus

const styles = StyleSheet.create({})
