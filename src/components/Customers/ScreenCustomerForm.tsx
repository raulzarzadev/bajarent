import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { FormCustomerE } from './FormCustomer'
import { useDispatch } from 'react-redux'
import {
  createCustomer,
  updateCustomer
} from '../../app/features/costumers/customersThunks'
import { NewCustomer } from '../../app/features/costumers/customerType'
import { AppDispatch } from '../../app/store'
import { useStore } from '../../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import { gStyles } from '../../styles'
import { useCustomers } from '../../app/features/costumers/costumersSlice'
import { useEffect, useState } from 'react'
const ScreenCustomerForm = (navigate) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation()

  const { storeId } = useStore()
  const { data: customers } = useCustomers()

  const customerId = navigate?.route?.params?.id
  const defaultCustomer = customers.find((c) => c.id === customerId) || null

  const handleSubmit = async (customer: NewCustomer) => {
    if (customerId) {
      //* Edit  customer
      await dispatch(updateCustomer({ customer, customerId }))
      navigation.goBack()
    } else {
      //* Create  customer
      const res = await dispatch(createCustomer({ customer, storeId }))
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

  if (customer === undefined) return <Text>Cargando...</Text>
  if (customer === null) return <Text>Cliente no encontrado</Text>

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
