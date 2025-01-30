import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { gStyles } from '../../styles'
import { CustomerImagesE } from './CustomerImages'
import { CustomerContactsE } from './CustomerContacts'
const CustomerOrder = (props?: CustomerOrderProps) => {
  const { data: customers, loading } = useCustomers()
  const customer = customers.find((c) => c.id === props.customerId)
  if (loading) return <Text>Loading...</Text>
  return (
    <View>
      <Text style={[gStyles.h3, { textAlign: 'left' }]}>{customer?.name}</Text>
      <Text style={[{ textAlign: 'left' }]}>
        {customer?.address?.neighborhood}
      </Text>
      <Text style={[{ textAlign: 'left' }]}>{customer?.address?.street}</Text>
      <Text style={[{ textAlign: 'left' }]}>
        {customer?.address?.references}
      </Text>

      <CustomerImagesE images={customer.images} customerId={customer.id} />
      <CustomerContactsE customerId={customer.id} />
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
