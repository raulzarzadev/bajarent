import React from 'react'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import Chip, { Size } from './Chip'
import { ViewStyle } from 'react-native'
import OrderType from '../types/OrderType'

const OrderStatus = ({
  order,
  chipStyles,
  chipSize
}: {
  order?: Partial<OrderType>
  chipStyles?: ViewStyle
  chipSize?: Size
}) => {
  const status = order?.status
  const color = STATUS_COLOR[status]
  const hasReport = order?.hasNotSolvedReports || order?.isReported
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
