import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { where } from 'firebase/firestore'
import ListOrders from '../ListOrders'
import useMyNav from '../../hooks/useMyNav'
const CustomerOrders = (props?: CustomerOrdersProps) => {
  const [orders, setOrders] = useState([])
  const { toCustomers } = useMyNav()
  useEffect(() => {
    ServiceOrders.findMany([where('customerId', '==', props?.customerId)]).then(
      (orders) => {
        setOrders(orders)
      }
    )
  }, [])
  return (
    <View>
      <ListOrders
        orders={orders}
        onPressRow={(id) => {
          toCustomers({ to: 'customerOrder', orderId: id })
        }}
      />
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
