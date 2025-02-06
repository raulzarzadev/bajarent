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
  const { permissions } = useEmployee()
  const { toCustomers } = useMyNav()
  const location = customer?.address?.locationURL || customer?.address?.coords
  const customerId = customer?.id
  const canEdit = customerId && permissions?.customers?.edit
  const canRead = customerId && permissions?.customers?.read
  return (
    <View>
      <Text style={[gStyles.h1, { textAlign: 'center' }]}>
        {customer?.name}{' '}
        {!!canEdit && (
          <Button
            icon="edit"
            variant="ghost"
            justIcon
            onPress={() => {
              toCustomers({ to: 'edit', id: customerId })
            }}
          />
        )}
        {!!canRead && (
          <Button
            icon="openEye"
            variant="ghost"
            justIcon
            onPress={() => {
              toCustomers({ to: 'details', id: customerId })
            }}
          />
        )}
        {/* {!!customerId && (
          <Button
            icon="edit"
            variant="ghost"
            justIcon
            onPress={() => {
              toCustomers({ to: 'edit', id: customerId })
            }}
          />
        )} */}
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
      />
      <CustomerImagesE images={customer?.images} customerId={customerId} />
    </View>
  )
}
export default CustomerCard
export type CustomerCardProps = {
  customer: Partial<CustomerType>
}
export const CustomerCardE = (props: CustomerCardProps) => (
  <ErrorBoundary componentName="CustomerCard">
    <CustomerCard {...props} />
  </ErrorBoundary>
)
