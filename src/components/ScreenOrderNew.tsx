import React from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderType, { order_status } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'
import { orderExpireAt } from '../libs/orders'
//
const ScreenOrderNew = ({ navigation }) => {
  const { storeId } = useStore()
  const { user } = useAuth()

  const handleSubmit = async (values: OrderType) => {
    const defaultValues = {
      //* Default values
      storeId: storeId,
      status: order_status.AUTHORIZED, //*****<--- always authorize
      authorizedAt: new Date(), //****+++++++*<--- always authorize
      authorizedBy: user?.id || '', //**++++***<--- always authorize
      deliveredAt: null,
      deliveredBy: null,
      ...values //********** <-- override default values
    }

    /* ********************************************
     *  if has delivered is true
     *******************************************rz */
    if (defaultValues?.hasDelivered) {
      defaultValues.status = order_status.DELIVERED
      defaultValues.deliveredAt = values.scheduledAt
      defaultValues.deliveredBy = user.id
    }
    defaultValues.expireAt = orderExpireAt({ order: values })
    defaultValues.statuses = true //* it means is set with expireAt

    //* remove spaces in each field before saving
    Object.keys(defaultValues).forEach((key) => {
      if (typeof defaultValues[key] === 'string') {
        const normalized = defaultValues[key].replace(/\s+/g, ' ')
        defaultValues[key] = normalized.trim()
      }
    })

    return await ServiceOrders.createSerialOrder(defaultValues).then(
      (orderId) => {
        if (orderId) {
          navigation.navigate('StackOrders', {
            screen: 'Orders',
            params: { orderId }
          })
          // navigation.navigate('Orders')
          // navigation.navigate('OrderDetails', { orderId })
        }
      }
    )
  }
  return <FormOrder onSubmit={handleSubmit} />
}

export default ScreenOrderNew
