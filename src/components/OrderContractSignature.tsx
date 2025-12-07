import { View } from 'react-native'
import { useOrderDetails } from '../contexts/orderContext'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import ErrorBoundary from './ErrorBoundary'
import {
	InputContractSignatureE,
	type InputContractSignatureValues
} from './InputContractSignature'

const OrderContractSignature = () => {
	const { order } = useOrderDetails()
	const { store } = useStore()
	const handleSignOrder = async (values: InputContractSignatureValues) => {
		ServiceOrders.update(order?.id, {
			contractSignature: values
		})
	}
	return (
		<View>
			<InputContractSignatureE
				values={order.contractSignature}
				setValues={handleSignOrder}
				contractURL={store?.orderTypesContract?.[order.type]}
				showReadContract={!!store?.orderTypesContract?.[order.type]}
			/>
		</View>
	)
}
export default OrderContractSignature
export const OrderContractSignatureE = () => (
	<ErrorBoundary componentName="OrderContractSignature">
		<OrderContractSignature />
	</ErrorBoundary>
)
