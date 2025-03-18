import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import {
  InputContractSignatureE,
  InputContractSignatureValues
} from './InputContractSignature'
import { useOrderDetails } from '../contexts/orderContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
const OrderContractSignature = (props?: OrderContractSignatureProps) => {
  const { order } = useOrderDetails()
  const handleSignOrder = async (values: InputContractSignatureValues) => {
    console.log('handleSignOrder', values)
    ServiceOrders.update(order?.id, {
      contractSignature: values
    })
  }
  return (
    <View>
      <InputContractSignatureE
        values={order.contractSignature}
        setValues={handleSignOrder}
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
