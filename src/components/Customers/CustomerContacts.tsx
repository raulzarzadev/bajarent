import { View, Text, Linking } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { gStyles } from '../../styles'
import Button from '../Button'
import useModal from '../../hooks/useModal'
import StyledModal from '../StyledModal'
import { FormikCustomerContacts } from './FormCustomer'
import { Formik } from 'formik'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import CardPhone from '../CardPhone'
const CustomerContacts = (props?: CustomerContactsProps) => {
  const { data: customers, loading, update } = useCustomers()
  const customerContacts = customers.find(
    (c) => c.id === props.customerId
  ).contacts
  const modal = useModal({ title: 'Agregar contacto' })
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={gStyles.h3}>Contactos </Text>
        <Button
          onPress={modal.toggleOpen}
          justIcon
          icon="edit"
          variant="ghost"
          size="small"
        />
      </View>
      {Object.entries(customerContacts || {}).map(
        ([id, contact]) =>
          contact &&
          !contact?.deletedAt && (
            <View
              key={contact?.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                maxWidth: 400,
                margin: 'auto'
              }}
            >
              <Text
                style={{ width: 120, alignSelf: 'center' }}
                numberOfLines={1}
              >
                {contact?.label}
              </Text>
              {/* <Text>{contact?.type}</Text> */}
              {contact.type === 'phone' && <CardPhone phone={contact.value} />}
              {contact.type === 'email' && (
                <View
                  style={{
                    flexDirection: 'row',
                    width: 200
                  }}
                >
                  <Text style={{ alignSelf: 'center' }}>{contact.value}</Text>
                  <Button
                    variant="ghost"
                    justIcon
                    icon="email"
                    onPress={() => {
                      Linking.openURL(`mailto:${contact.value}`)
                    }}
                  />
                </View>
              )}
            </View>
          )
      )}
      <StyledModal {...modal}>
        <Formik
          initialValues={{ contacts: customerContacts }}
          onSubmit={async (values) => {
            return await update(props.customerId, { contacts: values.contacts })
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <>
              <FormikCustomerContacts />
              <Button onPress={handleSubmit} disabled={isSubmitting}>
                Guardar
              </Button>
            </>
          )}
        </Formik>
      </StyledModal>
    </View>
  )
}
export default CustomerContacts
export type CustomerContactsProps = {
  customerId: string
}
export const CustomerContactsE = (props: CustomerContactsProps) => (
  <ErrorBoundary componentName="CustomerContacts">
    <CustomerContacts {...props} />
  </ErrorBoundary>
)
