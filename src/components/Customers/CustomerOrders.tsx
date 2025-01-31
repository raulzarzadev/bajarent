import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { where } from 'firebase/firestore'
import ListOrders from '../ListOrders'
const CustomerOrders = (props?: CustomerOrdersProps) => {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    ServiceOrders.findMany([where('customerId', '==', props?.customerId)]).then(
      (orders) => {
        setOrders(orders)
      }
    )
  }, [])
  return (
    <View>
      <ListOrders orders={orders} />
    </View>
  )
}
export default CustomerOrders
export type CustomerOrdersProps = {
  customerId: string
}
export const CustomerOrdersE = (props: CustomerOrdersProps) => (
  <ErrorBoundary componentName="CustomerOrders">
    <CustomerOrders {...props} />
  </ErrorBoundary>
)
