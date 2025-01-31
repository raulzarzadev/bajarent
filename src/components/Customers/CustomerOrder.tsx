import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { gStyles } from '../../styles'
import { CustomerImagesE } from './CustomerImages'
import { CustomerContactsE } from './CustomerContacts'
import LinkLocation from '../LinkLocation'
import Button from '../Button'
import useMyNav from '../../hooks/useMyNav'
const CustomerOrder = (props?: CustomerOrderProps) => {
  const { data: customers, loading } = useCustomers()
  const { toCustomers } = useMyNav()
  const customer = customers.find((c) => c.id === props.customerId)
  if (loading) return <Text>Loading...</Text>
  const location = customer?.address?.locationURL || customer.address?.coords
  return (
    <View>
      <Text style={[gStyles.h1, { textAlign: 'center' }]}>
        {customer?.name}{' '}
        <Button
          icon="edit"
          variant="ghost"
          justIcon
          onPress={() => {
            toCustomers({ to: 'edit', id: customer.id })
          }}
        />
      </Text>
      <Text style={[{ textAlign: 'center' }]}>
        {customer?.address?.neighborhood}
      </Text>
      <Text style={[{ textAlign: 'center' }]}>{customer?.address?.street}</Text>
      <Text style={[{ textAlign: 'center' }]}>
        {customer?.address?.references}
      </Text>
      {location && <LinkLocation location={location} />}

      <View style={{ marginBottom: 8 }} />

      <CustomerContactsE customerId={customer.id} />
      <CustomerImagesE images={customer.images} customerId={customer.id} />
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
