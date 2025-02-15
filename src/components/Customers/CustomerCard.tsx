import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { CustomerType } from '../../state/features/costumers/customerType'
import { gStyles } from '../../styles'
import Button from '../Button'
import useMyNav from '../../hooks/useMyNav'
import LinkLocation from '../LinkLocation'
import { CustomerContactsE } from './CustomerContacts'
import { CustomerImagesE } from './CustomerImages'
import { useEmployee } from '../../contexts/employeeContext'
const CustomerCard = (props?: CustomerCardProps) => {
  const customer = props?.customer
  const canEdit = props?.canEdit
  const { permissions } = useEmployee()
  const { toCustomers } = useMyNav()
  const location = customer?.address?.locationURL || customer?.address?.coords
  const customerId = customer?.id
  const canRead = customerId && permissions?.customers?.read
  if (!customer) return <Text>No hay cliente</Text>
  return (
    <View>
      <Text
        style={[gStyles.h1, { textAlign: 'center', justifyContent: 'center' }]}
      >
        {customer?.name}{' '}
        {!!canRead && (
          <Button
            icon="openEye"
            variant="ghost"
            justIcon
            size="xs"
            onPress={() => {
              toCustomers({ to: 'details', id: customerId })
            }}
          />
        )}
      </Text>
      <Text style={[{ textAlign: 'center' }]}>
        {customer?.address?.neighborhood}
      </Text>
      <Text style={[{ textAlign: 'center' }]}>{customer?.address?.street}</Text>
      <Text style={[{ textAlign: 'center' }]}>
        {customer?.address?.references}
      </Text>
      {!!location && <LinkLocation location={location} />}

      <View style={{ marginBottom: 8 }} />

      <CustomerContactsE
        customerId={customerId}
        customerContacts={customer.contacts}
        canAdd={canEdit}
      />
      <CustomerImagesE
        images={customer?.images}
        customerId={customerId}
        canAdd={canEdit}
      />
    </View>
  )
}
export default CustomerCard
export type CustomerCardProps = {
  customer: Partial<CustomerType>
  canEdit?: boolean
}
export const CustomerCardE = (props: CustomerCardProps) => (
  <ErrorBoundary componentName="CustomerCard">
    <CustomerCard {...props} />
  </ErrorBoundary>
)
