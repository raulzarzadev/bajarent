import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button from '../Button'
import useModal from '../../hooks/useModal'
import StyledModal from '../StyledModal'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import {
  customerFromOrder,
  findSimilarCustomer,
  mergeOrderCustomerWithFoundCustomer
} from './lib/customerFromOrder'
import { useStore } from '../../contexts/storeContext'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { ServiceCustomers } from '../../firebase/ServiceCustomers'
import { CustomerType } from '../../state/features/costumers/customerType'
const ModalCreateCustomers = (props?: ModalCreateCustomersProps) => {
  const modal = useModal()
  const [disabled, setDisabled] = useState(false)
  const [progress, setProgress] = useState(0)
  const { storeId } = useStore()
  // const { create: createCustomer } = useCustomers()
  const [storeCustomers, setStoreCustomers] = useState<Partial<CustomerType>[]>(
    []
  )
  const ordersIds = props?.ordersIds || []
  const [customerCreated, setCustomerCreated] = useState([])
  const [omittedCustomer, setCustomersOmitted] = useState([])
  const [mergedCustomers, setMergedCustomers] = useState([])
  useEffect(() => {
    // todas las ordenes y todos los clientes de las ordenes
    ServiceCustomers.getByStore(storeId).then((customers) => {
      setStoreCustomers(customers)
    })
  }, [ordersIds])

  const handleCreateCustomers = async () => {
    let newCustomersCreated: Partial<CustomerType>[] = [...storeCustomers]
    let omittedCustomer = []
    let mergedCustomers = []
    let index = 1
    for (const orderId of ordersIds) {
      setProgress(index++)
      debugger
      setDisabled(true)
      const dbOrder = await ServiceOrders.get(orderId)
      const orderCustomer = customerFromOrder(dbOrder)
      // check if similar customer already exist dont addit
      const similarCustomerFound = findSimilarCustomer(
        orderCustomer,
        newCustomersCreated
      )
      // if customer is excluded dont update/create customer and order
      if (dbOrder?.excludeCustomer) {
        //* CUSTOMER OMITTED
        omittedCustomer.push(orderCustomer)
        setCustomersOmitted(omittedCustomer)
        continue
      } // Salta a la siguiente iteración

      if (similarCustomerFound) {
        //merge customer
        const mergedCustomer = mergeOrderCustomerWithFoundCustomer(
          orderCustomer,
          similarCustomerFound
        )
        try {
          //update customer
          ServiceCustomers.update(similarCustomerFound.id, mergedCustomer)
          //update order
          ServiceOrders.update(orderId, {
            customerId: similarCustomerFound.id,
            customerName: mergedCustomer.name
          })
        } catch (error) {
          console.log(error)
        }
        //* CUSTOMER UPDATED
        mergedCustomers.push(mergedCustomer)
      } else {
        // get customer
        const res = await ServiceCustomers.create(orderCustomer)
        // update order
        const newCustomerId = res.res.id
        ServiceOrders.update(orderId, {
          customerId: newCustomerId,
          customerName: orderCustomer.name
        })
        //* CUSTOMER CREATED
        newCustomersCreated.push({ ...orderCustomer, id: newCustomerId })
      }
      setMergedCustomers(mergedCustomers)
      setCustomerCreated(newCustomersCreated)
      setCustomersOmitted(omittedCustomer)
    }
    setDisabled(false)
  }
  return (
    <View>
      <Button onPress={modal.toggleOpen} label="Crear clientes"></Button>
      <StyledModal {...modal} title="Crear Clientes">
        <Text style={{ marginVertical: 6 }}>
          Progreso {progress} de {ordersIds.length}
        </Text>
        <Text style={{ marginVertical: 6 }}>
          Clientes creados {customerCreated.length}
        </Text>
        <Text style={{ marginVertical: 6 }}>
          Clientes actualizados {mergedCustomers.length}
        </Text>
        <Text style={{ marginVertical: 6 }}>
          Clientes omitidos {omittedCustomer.length}
        </Text>
        <Button
          label="Crear clientes"
          disabled={disabled}
          onPress={() => {
            handleCreateCustomers()
          }}
        />
      </StyledModal>
    </View>
  )
}
export default ModalCreateCustomers
export type ModalCreateCustomersProps = {
  ordersIds?: string[]
}
export const ModalCreateCustomersE = (props: ModalCreateCustomersProps) => (
  <ErrorBoundary componentName="ModalCreateCustomers">
    <ModalCreateCustomers {...props} />
  </ErrorBoundary>
)
