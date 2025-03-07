import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import Button from '../Button'
import useMyNav from '../../hooks/useMyNav'
import { gStyles } from '../../styles'
import { CustomerImagesE } from './CustomerImages'
import { CustomerContactsE } from './CustomerContacts'
import { CustomerOrdersE } from './CustomerOrders'
import DocMetadata from '../DocMetadata'
import { useNavigation } from '@react-navigation/native'
import ButtonConfirm from '../ButtonConfirm'
import { useEmployee } from '../../contexts/employeeContext'
import { createContext, useContext } from 'react'

export const CustomerContext = createContext({ customer: null })
export const useCustomer = () => {
  return useContext(CustomerContext)
}
const ScreenCustomer = (params) => {
  const customerId = params.route.params.id
  const { data: customers, loading, remove } = useCustomers()

  const { permissions } = useEmployee()
  const sortCustomerPermissions = permissions.customers
  const { toCustomers } = useMyNav()
  const navigation = useNavigation()
  const customer = customers.find((c) => c.id === customerId)
  if (loading) return <Text>Cargando...</Text>
  if (!customer) return <Text>Cliente no encontrado</Text>

  return (
    <CustomerContext.Provider value={{ customer }}>
      <ScrollView>
        <DocMetadata item={customer} style={{ margin: 'auto' }} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 8,
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          {sortCustomerPermissions?.delete && (
            <ButtonConfirm
              handleConfirm={async () => {
                remove(customer.id)
                navigation.goBack()
              }}
              openLabel="Eliminar"
              openColor="error"
              openVariant="ghost"
              openSize="small"
              confirmColor="error"
              icon="delete"
              justIcon
            >
              <Text style={{ textAlign: 'center', marginVertical: 12 }}>
                ¡ Eliminar de forma permanente !
              </Text>
            </ButtonConfirm>
          )}
          {sortCustomerPermissions?.edit && (
            <Button
              icon="edit"
              justIcon
              variant="ghost"
              size="small"
              onPress={() => {
                toCustomers({ to: 'edit', id: customer.id })
              }}
            ></Button>
          )}

          <Text style={[gStyles.h2]}>{customer?.name} </Text>

          <Button
            icon="orderAdd"
            justIcon
            color="success"
            variant="ghost"
            size="small"
            onPress={() => {
              toCustomers({ customerId: customer?.id, to: 'newOrder' })
            }}
          ></Button>
        </View>
        <Text style={gStyles.h3}>Dirección</Text>
        <Text style={{ textAlign: 'center' }}>
          Colonia: {customer?.address?.neighborhood}
        </Text>
        <Text style={{ textAlign: 'center' }}>
          Calle: {customer?.address?.street}
        </Text>
        <Text style={{ textAlign: 'center' }}>
          Referencias: {customer?.address?.references}
        </Text>
        <CustomerContactsE
          customerId={customer.id}
          canAdd
          customerContacts={customer.contacts}
        />
        <CustomerImagesE
          images={customer?.images}
          customerId={customer?.id}
          canAdd
        />
        <CustomerOrdersE customerId={customer.id} />
      </ScrollView>
    </CustomerContext.Provider>
  )
}
export default ScreenCustomer
export type ScreenCustomerProps = {}
export const ScreenCustomerE = (props: ScreenCustomerProps) => (
  <ErrorBoundary componentName="ScreenCustomer">
    <ScreenCustomer {...props} />
  </ErrorBoundary>
)
