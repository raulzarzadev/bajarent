import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useOrderDetails } from '../../contexts/orderContext'
import { ServiceCustomers } from '../../firebase/ServiceCustomers'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import type { CustomerType } from '../../state/features/costumers/customerType'
import { gStyles } from '../../styles'
import type OrderType from '../../types/OrderType'
import ClientName from '../ClientName'
import ErrorBoundary from '../ErrorBoundary'
import OrderContacts from '../OrderContacts'
import { OrderAddress } from '../OrderDetails'
import OrderImages from '../OrderImages'
import { ButtonAddCustomerE } from './ButtonAddCustomer'
import { CustomerCardE } from './CustomerCard'

const CustomerOrder = ({ customerId, canViewActions = true }: CustomerOrderProps) => {
	const { order } = useOrderDetails()
	const { data: customers } = useCustomers()
	const [customer, setCustomer] = useState<CustomerType | undefined>()

	useEffect(() => {
		const currentCustomer = customerId || order?.customerId
		const customer = customers?.find(c => c.id === customerId)
		if (customer) {
			setCustomer(customer)
		} else {
			if (!currentCustomer) {
				setCustomer(undefined)
				return
			}
			ServiceCustomers.get(currentCustomer)
				.then(c => {
					setCustomer(c)
				})
				.catch(() => {
					setCustomer(undefined)
					console.log('cliente no encontrado')
				})
		}
	}, [customers, order])

	if (order?.excludeCustomer)
		return (
			<View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
				<Text style={gStyles.h2}>Orden sin cliente </Text>
				<ButtonAddCustomerE order={order} orderId={order?.id} />
			</View>
		)
	return (
		<View>
			<Text style={[gStyles.helper, { fontStyle: 'italic', textAlign: 'center' }]}>
				{[order?.fullName, order?.neighborhood, order?.address, order?.references]
					.filter(Boolean)
					.join(', ')}
			</Text>

			{customer ? (
				<CustomerCardE customer={customer} canViewActions={canViewActions} />
			) : (
				<OrderCustomerNotFound order={order} />
			)}
		</View>
	)
}

export const OrderCustomerNotFound = ({ order }: { order: OrderType }) => {
	return (
		<View>
			<View
				style={{
					padding: 4,
					flexDirection: 'row',
					justifyContent: 'center'
				}}
			>
				<ClientName order={order} style={gStyles.h1} />
				<ButtonAddCustomerE order={order} orderId={order?.id} />
			</View>
			<OrderContacts />
			<OrderImages order={order} />
			<ErrorBoundary componentName="OrderAddress">
				<OrderAddress order={order} />
			</ErrorBoundary>
		</View>
	)
}

export default CustomerOrder
export type CustomerOrderProps = {
	customerId?: string
	canViewActions?: boolean
}
export const CustomerOrderE = (props: CustomerOrderProps) => (
	<ErrorBoundary componentName="CustomerOrder">
		<CustomerOrder {...props} />
	</ErrorBoundary>
)
