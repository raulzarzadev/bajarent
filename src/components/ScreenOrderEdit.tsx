import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import FormOrder from './FormOrder'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ActivityIndicator } from 'react-native'

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
        console.log(values)
        ServiceOrders.update(orderId, values)
          .then((res) => {
            console.log(res)
            // navigation.goBack()
          })
          .catch(console.error)
      }}
    />
  )
}

export default ScreenOrderEdit

const styles = StyleSheet.create({})
