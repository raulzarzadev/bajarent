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
    //* Default values
    values.storeId = storeId
    values.status = order_status.PENDING
    values.deliveredAt = null
    values.deliveredBy = null

    if (canAuthorizeOrder) {
      values.status = order_status.AUTHORIZED
      values.authorizedAt = new Date()
      values.authorizedBy = user.id
    }

    //* if has delivered is true
    if (values.hasDelivered) {
      values.status = order_status.DELIVERED
      values.deliveredAt = values.scheduledAt
      values.deliveredBy = user.id
    }

    //* if type is local rent
    if (values.type === order_type.RENT) {
      values.status = order_status.DELIVERED
      values.deliveredAt = new Date()
      values.deliveredBy = user.id
    }

    // if (values.type === order_type.REPAIR) {
    //   values.items = values.items.map((item) => {
    //     item.priceSelected = null
    //     item.priceSelectedId = null
    //     return item
    //   })
    // }

    return await ServiceOrders.create(values)
      .then((res) => {
        const orderId = res?.res?.id
        //  console.log({ res })
        // console.log({ res })

        navigation.navigate('Orders')
        navigation.navigate('OrderDetails', { orderId })

        // alert('Orden creada')
      })
      .catch(console.error)
  }
  return <FormOrder onSubmit={handleSubmit} />
}

export default ScreenOrderNew
