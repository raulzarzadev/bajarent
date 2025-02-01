import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'

import { CustomerCardE } from './CustomerCard'
const CustomerOrder = (props?: CustomerOrderProps) => {
  const { data: customers, loading } = useCustomers()
  const customer = customers.find((c) => c.id === props.customerId)
  if (loading) return <Text>Loading...</Text>
  return (
    <View>
      <CustomerCardE customer={customer} />
    </View>
  )
}

export default CustomerOrder
export type CustomerOrderProps = {
  customerId: string
}
export const CustomerOrderE = (props: CustomerOrderProps) => (
  <ErrorBoundary componentName="CustomerOrder">
    <CustomerOrder {...props} />
  </ErrorBoundary>
)
