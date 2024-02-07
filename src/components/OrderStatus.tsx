import React from 'react'
import { STATUS_COLOR } from '../theme'
import dictionary from '../dictionary'
import { useStore } from '../contexts/storeContext'
import Chip from './Chip'

const OrderStatus = ({ orderId }: { orderId?: string }) => {
  const { orders } = useStore()
  const order = orders.find((order) => order.id === orderId)
  const status = order?.status
  const color = STATUS_COLOR[order?.status]
  const hasReport = order?.hasNotSolvedReports

  return (
    <Chip
      title={dictionary(status)}
      color={hasReport ? STATUS_COLOR.REPORTED : color}
    />
  )
}

export default OrderStatus
