import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { order_type } from '../types/OrderType'
import { useAuth } from '../contexts/authContext'

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
        //* if has delivered is true
        if (values.hasDelivered) {
          values.updatedBy = user.id
        }
        //* if type is store rent
        if (values.type === order_type.STORE_RENT) {
          values.updatedBy = user.id
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
