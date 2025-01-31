import { View, Text, Pressable } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { CustomerType } from '../../state/features/costumers/customerType'
import Button from '../Button'
import StyledModal from '../StyledModal'
import useModal from '../../hooks/useModal'
import { gStyles } from '../../styles'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { useEffect, useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import { ServiceOrders } from '../../firebase/ServiceOrders'
const ButtonAddCustomer = (props?: ButtonAddCustomerProps) => {
  const modal = useModal({ title: 'Agregar cliente' })
  const [selectedSimilarCustomer, setSelectedSimilarCustomer] = useState(null)
  const handleSelectCustomer = (customerId) => {
    if (selectedSimilarCustomer === customerId) {
      setSelectedSimilarCustomer(null)
    } else {
      setSelectedSimilarCustomer(customerId)
    }
  }
  const { data: customers } = useCustomers()
  const customer = props?.customer
  const { create } = useCustomers()
  const { storeId } = useStore()
  const [disabled, setDisabled] = useState(false)
  const handleAddCustomer = async () => {
    setDisabled(true)
    const orderId = customer.orderId
    delete customer.orderId
    delete customer.storeId
    delete customer.orderFolio
    const customersSelectedName = customers.find(
      (c) => c.id === selectedSimilarCustomer
    ).name

    //* if client are selected from similar customers just update the order with the customerId
    //* else create a new customer and update the order with the customerId
    if (selectedSimilarCustomer) {
      const orderCreated = await ServiceOrders.update(orderId, {
        customerId: selectedSimilarCustomer,
        fullName: customersSelectedName
      })
    } else {
      const customerCreated = await create(storeId, customer)
      const customerId = customerCreated.payload?.id

      const orderCreated = await ServiceOrders.update(orderId, {
        customerId
      })
    }
    modal.toggleOpen()
    setDisabled(false)
  }
  return (
    <View>
      <Button
        icon="add"
        onPress={modal.toggleOpen}
        variant="ghost"
        justIcon
        size="xs"
      />
      <StyledModal {...modal}>
        <View>
          <Text>{customer.name}</Text>
          {Object.values(customer.contacts || {}).map((contact) => (
            <Text key={contact.id}>{contact.value}</Text>
          ))}
          <Text>{customer.address.street}</Text>
          <Text>{customer.address.neighborhood}</Text>
        </View>
        <SimilarCustomers
          customer={customer}
          onSelectCustomerId={handleSelectCustomer}
          selectedCustomerId={selectedSimilarCustomer}
        />
        <Button onPress={modal.toggleOpen} label="Cancelar"></Button>

        <Button
          disabled={disabled}
          label={
            selectedSimilarCustomer ? 'Agregar a cliente' : 'Crear cliente'
          }
          onPress={handleAddCustomer}
        ></Button>
      </StyledModal>
    </View>
  )
}
const SimilarCustomers = ({
  customer,
  onSelectCustomerId,
  selectedCustomerId
}) => {
  const { data: customers } = useCustomers()

  const [similarCustomers, setSimilarCustomers] = useState([])
  console.log({ customer, similarCustomers })
  useEffect(() => {
    if (customers.length) {
      const similarCustomers = customers.filter((c) => {
        const sameName = c.name.toLowerCase() === customer.name.toLowerCase()
        const someSameContact = Object.values(c.contacts || {}).some(
          (contact) => {
            return Object.values(customer.contacts).some((contact2) => {
              return contact.value === contact2.value
            })
          }
        )
        return sameName || someSameContact
      })
      setSimilarCustomers(similarCustomers)
    }
  }, [])
  return (
    <View>
      <Text style={gStyles.h2}>Clientes con datos similares</Text>
      {similarCustomers.map((c) => (
        <Pressable
          key={c.id}
          onPress={() => onSelectCustomerId(c.id)}
          style={{
            borderWidth: 2,
            borderColor: selectedCustomerId === c.id ? 'black' : 'transparent',
            borderStyle: 'dashed'
          }}
        >
          <Text>{c.name}</Text>
          {Object.values(c.contacts || {}).map((contact) => (
            <Text key={contact.id}>{contact.value}</Text>
          ))}
          <Text>{c?.address?.street}</Text>
          <Text>{c?.address?.neighborhood}</Text>
        </Pressable>
      ))}
    </View>
  )
}
export default ButtonAddCustomer
export type ButtonAddCustomerProps = {
  customer: Partial<CustomerType>
}
export const ButtonAddCustomerE = (props: ButtonAddCustomerProps) => (
  <ErrorBoundary componentName="ButtonAddCustomer">
    <ButtonAddCustomer {...props} />
  </ErrorBoundary>
)
