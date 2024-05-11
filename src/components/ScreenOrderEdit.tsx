import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { order_status, order_type } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'
import { orderExpireAt } from '../libs/orders'

const ScreenOrderEdit = ({ route, navigation }) => {
  const orderId = route?.params?.orderId
  const [order, setOrder] = useState(undefined)
  const { user } = useAuth()

  useEffect(() => {
    ServiceOrders.get(orderId).then(setOrder)
  }, [orderId])
  if (!order) return <ActivityIndicator />

  return (
    <FormOrder
      defaultValues={order}
      onSubmit={async (values) => {
        //* if type is store rent
        if (values.type === 'RENT') {
          values.updatedBy = user.id
        }

        //* if has delivered is true
        if (values.hasDelivered) {
          values.status = order_status.DELIVERED
          values.deliveredAt = values.scheduledAt
          values.deliveredBy = user.id
        }

        values.expireAt = orderExpireAt({ order: values })
        values.statuses = true //* it means is set with expireAt

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
