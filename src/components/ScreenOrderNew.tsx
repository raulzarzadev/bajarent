import React from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import OrderType, { order_status, order_type } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'
import { useEmployee } from '../contexts/employeeContext'

const ScreenOrderNew = ({ navigation }) => {
  const { storeId } = useStore()
  const { user } = useAuth()
  const { permissions } = useEmployee()
  const canAuthorizeOrder =
    permissions.orders.canAuthorize ||
    permissions.isAdmin ||
    permissions.isOwner
  const handleSubmit = async (values: OrderType) => {
    const defaultValues = {
      //* Default values
      storeId: storeId,
      status: order_status.PENDING,
      deliveredAt: null,
      deliveredBy: null,
      authorizedAt: null,
      authorizedBy: null
    }

    /* ********************************************
     *  override default values
     *******************************************rz */

    values = { ...defaultValues, ...values }

    /* ********************************************
     *  authorize order just in time, just if user has permission
     *******************************************rz */
    if (canAuthorizeOrder) {
      values.status = order_status.AUTHORIZED
      values.authorizedAt = new Date()
      values.authorizedBy = user.id
    }

    /* ********************************************
     *  if has delivered is true
     *******************************************rz */
    if (values.hasDelivered) {
      values.status = order_status.DELIVERED
      values.deliveredAt = values.scheduledAt
      values.deliveredBy = user.id
    }

    return await ServiceOrders.createSerialOrder(values).then((orderId) => {
      if (orderId) {
        navigation.navigate('Orders')
        navigation.navigate('OrderDetails', { orderId })
      }
    })
  }
  return <FormOrder onSubmit={handleSubmit} />
}

export default ScreenOrderNew
