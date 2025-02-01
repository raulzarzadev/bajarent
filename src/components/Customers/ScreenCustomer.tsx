import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import Button from '../Button'
import useMyNav from '../../hooks/useMyNav'
import { gStyles } from '../../styles'
import { CustomerImagesE } from './CustomerImages'
import { CustomerContactsE } from './CustomerContacts'
import { CustomerOrdersE } from './CustomerOrders'
const ScreenCustomer = (params) => {
  const customerId = params.route.params.id
  const { data: customers, loading } = useCustomers()
  const { toOrders, toCustomers } = useMyNav()
  const customer = customers.find((c) => c.id === customerId)
  if (loading) return <Text>Cargando...</Text>
  if (!customer) return <Text>Cliente no encontrado</Text>
  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 8,
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <Button
          icon="edit"
          justIcon
          variant="ghost"
          size="small"
          onPress={() => {
            toCustomers({ to: 'edit', id: customer.id })
          }}
        ></Button>
        <Text style={[gStyles.h2]}>{customer?.name} </Text>

        <Button
          icon="orderAdd"
          justIcon
          color="success"
          variant="ghost"
          size="small"
          onPress={() => {
            toOrders({ customerId: customer?.id, screenNew: true })
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
      <CustomerContactsE customerId={customer.id} />
      <CustomerImagesE images={customer?.images} customerId={customer?.id} />
      <CustomerOrdersE customerId={customer.id} />
    </ScrollView>
  )
}
export default ScreenCustomer
export type ScreenCustomerProps = {}
export const ScreenCustomerE = (props: ScreenCustomerProps) => (
  <ErrorBoundary componentName="ScreenCustomer">
    <ScreenCustomer {...props} />
  </ErrorBoundary>
)
