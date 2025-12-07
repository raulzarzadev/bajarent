import { useRoute } from '@react-navigation/native'
import { createContext, useContext, useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native'
import { ServiceCustomers } from '../../firebase/ServiceCustomers'
import type { CustomerType } from '../../state/features/costumers/customerType'
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
	const [customer, setCustomer] = useState<CustomerType | null>()
	useEffect(() => {
		if (customerId)
			ServiceCustomers.get(customerId).then(c => {
				setCustomer(c || null)
			})
	}, [customerId])

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
