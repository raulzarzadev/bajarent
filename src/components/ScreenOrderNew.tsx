import React from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderType, { order_status } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'

const ScreenOrderNew = ({ navigation }) => {
  const { storeId } = useStore()
  const { user } = useAuth()
  const handleSubmit = async (values: OrderType) => {
    if (values.hasDelivered) {
      values.status = order_status.DELIVERED
      values.deliveredAt = values.scheduledAt
      values.deliveredBy = user.id
    } else {
      values.status = order_status.PENDING
      values.deliveredAt = null
      values.deliveredBy = null
    }
    values.storeId = storeId
    return await ServiceOrders.create(values)
      .then((res) => {
        const orderId = res?.res?.id
        //  console.log({ res })
        console.log({ res })

        navigation.navigate('Orders')
        navigation.navigate('OrderDetails', { orderId })

        // alert('Orden creada')
      })
      .catch(console.error)
  }
  return <FormOrder onSubmit={handleSubmit} />
}

export default ScreenOrderNew
