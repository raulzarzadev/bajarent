import React from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderType, { order_status } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'

const ScreenNewOrder = ({ navigation }) => {
  const { storeId } = useStore()
  const { user } = useAuth()
  const handleSubmit = async (values: OrderType) => {
    if (values.hasDelivered) {
      values.status = order_status.DELIVERED
      values.deliveredAt = values.scheduledAt
      values.deliveredBy = user.id
    }
    values.storeId = storeId
    return await ServiceOrders.create(values)
      .then((res) => {
        const orderId = res?.res?.id
        //  console.log({ res })
        navigation.push('OrderDetails', { orderId })
        // alert('Orden creada')
      })
      .catch(console.error)
  }
  return <FormOrder onSubmit={handleSubmit} />
}

export default ScreenNewOrder
