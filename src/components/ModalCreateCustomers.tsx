import { View, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import Button from './Button'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import OrderType, { order_status } from '../types/OrderType'
import { CustomerType } from '../state/features/costumers/customerType'
const ModalCreateCustomers = (props?: ModalCreateCustomersProps) => {
  const modal = useModal({ title: 'Create customers' })
  const orders: Partial<OrderType>[] = [
    {
      id: '1',
      fullName: 'Nombre completo',
      neighborhood: 'neighborhood',
      phone: '+525543374018',
      status: order_status.AUTHORIZED,
      address: 'address'
    }
  ]
  const customersPre: Partial<CustomerType>[] = [{}]
  return (
    <View>
      <Button label="Create customers" onPress={modal.toggleOpen} />
      <StyledModal {...modal}></StyledModal>
    </View>
  )
}
export default ModalCreateCustomers
export type ModalCreateCustomersProps = {}
export const ModalCreateCustomersE = (props: ModalCreateCustomersProps) => (
  <ErrorBoundary componentName="ModalCreateCustomers">
    <ModalCreateCustomers {...props} />
  </ErrorBoundary>
)
