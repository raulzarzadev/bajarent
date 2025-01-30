import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { FormCustomerE } from './FormCustomer'
import { NewCustomer } from '../../state/features/costumers/customerType'
import { useStore } from '../../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import { gStyles } from '../../styles'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { useEffect, useState } from 'react'
const ScreenCustomerForm = (navigate) => {
  const customerId = navigate?.route?.params?.id
  const navigation = useNavigation()

  const { storeId } = useStore()
  const { data: customers, create, update } = useCustomers()

  const defaultCustomer = customers.find((c) => c.id === customerId) || null

  const handleSubmit = async (customer: NewCustomer) => {
    if (customerId) {
      //* Edit  customer
      await update(customerId, customer)
      navigation.goBack()
    } else {
      //* Create  customer
      await create(storeId, customer)
      navigation.goBack()
    }
  }
  const [customer, setCustomer] = useState<NewCustomer>(undefined)
  useEffect(() => {
    if (customers && customerId) {
      const customer = customers.find((c) => c.id === customerId)
      setCustomer(customer)
    } else {
      setCustomer(null)
    }
  }, [customers])

  if (customerId && customer === undefined) return <Text>Cargando...</Text>
  //if (customer === null) return <Text>Cliente no encontrado</Text>

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormCustomerE
          onSubmit={handleSubmit}
          defaultValues={defaultCustomer}
        />
      </View>
    </ScrollView>
  )
}
export default ScreenCustomerForm
export type ScreenCustomerFormProps = {}
export const ScreenCustomerFormE = (props: ScreenCustomerFormProps) => (
  <ErrorBoundary componentName="ScreenCustomerForm">
    <ScreenCustomerForm {...props} />
  </ErrorBoundary>
)
