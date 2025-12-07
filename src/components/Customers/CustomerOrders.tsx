import { where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import useMyNav from '../../hooks/useMyNav'
import ErrorBoundary from '../ErrorBoundary'
import ListOrders from '../ListOrders'

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
