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
import InputMapLocation from '../InputMapLocation'
import { ModalLocationE } from '../ModalLocation'
import { updateCustomer } from '../../state/features/costumers/customersThunks'
import CoordsType from '../../types/CoordsType'
import { CustomerCardE } from './CustomerCard'

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
        <CustomerCardE customer={customer} />
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
