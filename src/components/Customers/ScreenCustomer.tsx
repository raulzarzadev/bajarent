import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../app/features/costumers/costumersSlice'
import Button from '../Button'
import useMyNav from '../../hooks/useMyNav'
import { gStyles } from '../../styles'
const ScreenCustomer = (params) => {
  const customerId = params.route.params.id
  const { data: customers, loading } = useCustomers()
  const { toCustomers } = useMyNav()
  const customer = customers.find((c) => c.id === customerId)
  if (!customer) return <Text>Cliente no encontrado</Text>
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 8,
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={[gStyles.h2]}>{customer?.name} </Text>
        <Button
          icon="edit"
          justIcon
          variant="ghost"
          size="small"
          onPress={() => {
            toCustomers({ to: 'edit', id: customer.id })
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
      <Text style={gStyles.h3}>Contactos</Text>
      {Object.entries(customer?.contacts || {}).map(([id, contact]) => (
        <View
          key={contact?.id}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            maxWidth: 400,
            margin: 'auto'
          }}
        >
          <Text style={{ width: 100 }}>{contact?.label}</Text>
          {/* <Text>{contact?.type}</Text> */}
          <Text>{contact?.value}</Text>
        </View>
      ))}
    </View>
  )
}
export default ScreenCustomer
export type ScreenCustomerProps = {}
export const ScreenCustomerE = (props: ScreenCustomerProps) => (
  <ErrorBoundary componentName="ScreenCustomer">
    <ScreenCustomer {...props} />
  </ErrorBoundary>
)
