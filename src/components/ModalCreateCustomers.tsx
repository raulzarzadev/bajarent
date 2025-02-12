import { View, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import Button from './Button'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import OrderType from '../types/OrderType'
import { CustomerType } from '../state/features/costumers/customerType'
import { useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
const ModalCreateCustomers = (props?: ModalCreateCustomersProps) => {
  const selectedOrdersIds = props?.ordersIds
  const modal = useModal({ title: 'Create customers' })
  //get selected orders
  //get customer from orders orderCustomer
  //get storeCustomer
  //for each orderClient search if exists in storeCustomer
  //search if exists similar storeCustomer
  //if exist merge-replaceInOrderAndMergeWithSimilar ✅
  //if not similar storeCustomer create client ✅
  //* NO //if similar storeCustomers exists show it in a list and chose one to replace-InOrder | merge-replaceInOrderAndMergeWithSimilar | create-createNewCustomer ✅

  const [fullOrders, setFullOrders] = useState<OrderType[]>([])
  const handleGetSelectedOrders = () => {
    const promisesGetOrders = selectedOrdersIds.map((orderId) => {
      return ServiceOrders.get(orderId).then((res) => res)
    })
    Promise.all(promisesGetOrders).then((res) => {
      setFullOrders(res as OrderType[])
    })
  }
  const customersPre: Partial<CustomerType>[] = [{}]
  return (
    <View>
      <Button label="Create customers" onPress={modal.toggleOpen} />
      <StyledModal {...modal}>
        <Button
          onPress={handleGetSelectedOrders}
          label="Clientes desde ordenes"
        ></Button>
      </StyledModal>
    </View>
  )
}
export default ModalCreateCustomers
export type ModalCreateCustomersProps = {
  ordersIds: OrderType['id'][]
}
export const ModalCreateCustomersE = (props: ModalCreateCustomersProps) => (
  <ErrorBoundary componentName="ModalCreateCustomers">
    <ModalCreateCustomers {...props} />
  </ErrorBoundary>
)
