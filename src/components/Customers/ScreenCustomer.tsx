import { useRoute } from '@react-navigation/native'
import { createContext, useContext, useEffect } from 'react'
import { ScrollView, Text } from 'react-native'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import DocMetadata from '../DocMetadata'
import ErrorBoundary from '../ErrorBoundary'
import { CustomerCardE } from './CustomerCard'
import { CustomerOrdersE } from './CustomerOrders'

export const CustomerContext = createContext({ customer: null })
export const useCustomer = () => {
	return useContext(CustomerContext)
}
const ScreenCustomer = () => {
	const route = useRoute()
	const customerId = (route.params as { id?: string } | undefined)?.id

	const { data: customers, fetch: fetchCustomers } = useCustomers()

	useEffect(() => {
		fetchCustomers()
	}, [])

	const customer = customers?.find(c => c.id === customerId)

	if (!customerId) return <Text>Cliente no encontrado</Text>
	if (customer === undefined) return <Text>Cargando...</Text>
	if (customer === null) return <Text>Cliente no encontrado</Text>

	return (
		<CustomerContext.Provider value={{ customer }}>
			<ScrollView>
				<DocMetadata item={customer} style={{ margin: 'auto' }} />
				<CustomerCardE customer={customer} />
				<CustomerOrdersE customerId={customer?.id} />
			</ScrollView>
		</CustomerContext.Provider>
	)
}
export default ScreenCustomer
export const ScreenCustomerE = () => (
	<ErrorBoundary componentName="ScreenCustomer">
		<ScreenCustomer />
	</ErrorBoundary>
)
