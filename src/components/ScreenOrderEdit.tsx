import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { order_status, order_type } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'
import { orderExpireAt } from '../libs/orders'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import TextInfo from './TextInfo'

const ScreenOrderEdit = ({ route, navigation }) => {
  const orderId = route?.params?.orderId
  const [order, setOrder] = useState(undefined)
  const { update } = useCustomers()
  const { user } = useAuth()

  useEffect(() => {
    ServiceOrders.get(orderId).then(setOrder)
  }, [orderId])
  if (!order) return <ActivityIndicator />

  return (
    <>
      {order?.customerId && (
        <TextInfo
          type="warning"
          defaultVisible
          text="Algunos campos NO se editaran correctamente. Edita al cliente directamente para cambiarlos."
        />
      )}
      <FormOrder
        defaultValues={order}
        onSubmit={async (values) => {
          if (order.customerId) {
            await update(order.customerId, {
              name: values.fullName || '',
              //@ts-ignore //* Just will update some basic values
              address: {
                street: values?.address || '',
                references: values?.references || '',
                neighborhood: values?.neighborhood || ''
              }
            })
          }
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
          //* remove spaces in each field before saving
          Object.keys(values).forEach((key) => {
            if (typeof values[key] === 'string') {
              const normalized = values[key].replace(/\s+/g, ' ')
              values[key] = normalized.trim()
            }
          })
          return ServiceOrders.update(orderId, values)
            .then((res) => {
              // console.log(res)
              navigation.goBack()
            })
            .catch(console.error)
        }}
      />
    </>
  )
}

export default ScreenOrderEdit
