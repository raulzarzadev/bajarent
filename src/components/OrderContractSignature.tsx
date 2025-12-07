import { View } from 'react-native'
import { useOrderDetails } from '../contexts/orderContext'
import { useStore } from '../contexts/storeContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import ErrorBoundary from './ErrorBoundary'
import {
	InputContractSignatureE,
	type InputContractSignatureValues
} from './InputContractSignature'

const OrderContractSignature = (props?: OrderContractSignatureProps) => {
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
export type OrderContractSignatureProps = {}
export const OrderContractSignatureE = (props: OrderContractSignatureProps) => (
	<ErrorBoundary componentName="OrderContractSignature">
		<OrderContractSignature {...props} />
	</ErrorBoundary>
)
