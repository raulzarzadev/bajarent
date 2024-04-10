import React from 'react'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import { useStore } from '../contexts/storeContext'
import Chip, { Size } from './Chip'
import { ViewStyle } from 'react-native'

const OrderStatus = ({
  orderId,
  chipStyles,
  chipSize
}: {
  orderId?: string
  chipStyles?: ViewStyle
  chipSize?: Size
}) => {
  const { orders } = useStore()
  const order = orders.find((order) => order.id === orderId)
  const status = order?.status
  const color = STATUS_COLOR[order?.status]
  const hasReport = order?.hasNotSolvedReports
  return (
    <Chip
      style={[chipStyles]}
      title={dictionary(status)}
      color={hasReport ? STATUS_COLOR.REPORTED : color}
      size={chipSize}
    />
  )
}

export default OrderStatus
