import { View, Text, Pressable } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button from '../Button'
import StyledModal from '../StyledModal'
import useModal from '../../hooks/useModal'
import { gStyles } from '../../styles'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import { useEffect, useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import TextInfo from '../TextInfo'
import { ConsolidatedOrderType } from '../../firebase/ServiceConsolidatedOrders'
import OrderType from '../../types/OrderType'
import { customerFromOrder } from './lib/customerFromOrder'
import { CustomerCardE } from './CustomerCard'

const ButtonAddCustomer = (props?: ButtonAddCustomerProps) => {
  const order = props?.order
  const orderId = order?.id
  const customer = customerFromOrder(order)
  const modal = useModal({ title: 'Agregar cliente' })
  const [selectedSimilarCustomer, setSelectedSimilarCustomer] = useState(null)
  const handleSelectCustomer = (customerId) => {
    if (selectedSimilarCustomer === customerId) {
      setSelectedSimilarCustomer(null)
    } else {
      setSelectedSimilarCustomer(customerId)
    }
  }
  const { create } = useCustomers()
  const { storeId } = useStore()
  const [disabled, setDisabled] = useState(false)

  const handleAddCustomer = async () => {
    setDisabled(true)
    //FIXME esto parece que no funciona
    //  */

    //* if client are selected from similar customers just update the order with the customerId
    //* else create a new customer and update the order with the customerId
    if (selectedSimilarCustomer?.id) {
      await ServiceOrders.update(orderId, {
        customerId: selectedSimilarCustomer?.id,
        fullName: selectedSimilarCustomer?.name
      })
        .then((res) => {
          console.log({ res })
          modal.toggleOpen()
          setDisabled(false)
        })
        .catch((error) => {
          console.error('Error updating order', error)
          setDisabled(false)
        })
    } else {
      const customerCreated = await create(storeId, customer)
      //@ts-ignore
      const customerId = customerCreated.payload?.id

      await ServiceOrders.update(orderId, {
        customerId
      })
        .then((res) => {
          console.log({ res })
          modal.toggleOpen()
          setDisabled(false)
        })
        .catch((error) => {
          console.error('Error updating order', error)
          setDisabled(false)
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
        <CustomerCardE customer={customer} />

        <SimilarCustomers
          customer={customer}
          onSelectCustomer={handleSelectCustomer}
          selectedCustomer={selectedSimilarCustomer}
        />
        <View style={{ height: 60 }}>
          {selectedSimilarCustomer && (
            <TextInfo
              text={`Se editara el nombre en la orden original y se agregara esta orden al cliente seleccionado ${selectedSimilarCustomer?.name}`}
              type="warning"
              defaultVisible
            />
          )}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button
            onPress={modal.toggleOpen}
            label="Cancelar"
            variant="ghost"
          ></Button>

          <Button
            disabled={disabled}
            label={
              selectedSimilarCustomer ? 'Agregar a cliente' : 'Crear cliente'
            }
            color={selectedSimilarCustomer ? 'primary' : 'success'}
            onPress={handleAddCustomer}
          ></Button>
        </View>
      </StyledModal>
    </View>
  )
}
const SimilarCustomers = ({ customer, onSelectCustomer, selectedCustomer }) => {
  const { data: customers } = useCustomers()

  const [similarCustomers, setSimilarCustomers] = useState([])
  //console.log({ customer, similarCustomers })
  useEffect(() => {
    if (customers.length) {
      const similarCustomers = customers.filter((c) => {
        const sameName = c.name.toLowerCase() === customer?.name.toLowerCase()
        const someSameContact = Object.values(c.contacts || {}).some(
          (contact) => {
            return Object.values(customer?.contacts).some((contact2) => {
              //@ts-ignore
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
          onPress={() => onSelectCustomer(c)}
          style={{
            borderWidth: 2,
            borderColor:
              selectedCustomer && selectedCustomer?.id === c?.id
                ? 'black'
                : 'transparent',
            borderStyle: 'dashed'
          }}
        >
          <Text>{c.name}</Text>
          {Object.values(c.contacts || {}).map((contact) => (
            //@ts-ignore
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
  order: Partial<ConsolidatedOrderType> | Partial<OrderType>
}
export const ButtonAddCustomerE = (props: ButtonAddCustomerProps) => (
  <ErrorBoundary componentName="ButtonAddCustomer">
    <ButtonAddCustomer {...props} />
  </ErrorBoundary>
)
