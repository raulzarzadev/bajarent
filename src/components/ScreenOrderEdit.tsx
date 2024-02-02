import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { order_status } from '../types/OrderType'

const ScreenOrderEdit = ({ route, navigation }) => {
  const orderId = route?.params?.orderId
  const [order, setOrder] = useState(undefined)
  useEffect(() => {
    ServiceOrders.get(orderId).then(setOrder)
  }, [orderId])
  if (!order) return <ActivityIndicator />

  return (
    <FormOrder
      defaultValues={order}
      onSubmit={async (values) => {
        if (values.hasDelivered) {
          values.status = order_status.DELIVERED
          values.deliveredAt = values.scheduledAt
        } else {
          values.status = order_status.PENDING
          values.deliveredAt = null
        }
        ServiceOrders.update(orderId, values)
          .then((res) => {
            // console.log(res)
            navigation.goBack()
          })
          .catch(console.error)
      }}
    />
  )
}

export default ScreenOrderEdit
