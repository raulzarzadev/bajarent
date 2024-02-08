import { Text, TextStyle } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import { gStyles } from '../styles'

const ClientName = ({
  order,
  style
}: {
  order: Partial<OrderType>
  style?: TextStyle
}) => {
  const clientName =
    order?.fullName || ` ${order?.firstName || ''} ${order?.lastName || ''}`
  return <Text style={[gStyles.p, style]}>{clientName}</Text>
}

export default ClientName
