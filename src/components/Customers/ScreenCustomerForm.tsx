import type { RouteProp } from '@react-navigation/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useStore } from '../../contexts/storeContext'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import type { NewCustomer } from '../../state/features/costumers/customerType'
import { gStyles } from '../../styles'
import ErrorBoundary from '../ErrorBoundary'
import { FormCustomerE } from './FormCustomer'

type ScreenCustomerFormRouteProp = RouteProp<Record<string, { id?: string }>, string>

const ScreenCustomerForm = () => {
	const { params } = useRoute<ScreenCustomerFormRouteProp>()
	const customerId = params?.id
	const navigation = useNavigation()

	const { storeId } = useStore()
	const { data: customers, create, update } = useCustomers()

	const defaultCustomer = customers.find(c => c.id === customerId) || null

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
			const customer = customers.find(c => c.id === customerId)
			setCustomer(customer)
		} else {
			setCustomer(null)
		}
	}, [customers])

	if (customerId && customer === undefined) return <Text>Cargando...</Text>

	return (
		<ScrollView>
			<View style={gStyles.container}>
				<FormCustomerE onSubmit={handleSubmit} defaultValues={defaultCustomer} />
			</View>
		</ScrollView>
	)
}
export default ScreenCustomerForm
export const ScreenCustomerFormE = () => (
	<ErrorBoundary componentName="ScreenCustomerForm">
		<ScreenCustomerForm />
	</ErrorBoundary>
)
