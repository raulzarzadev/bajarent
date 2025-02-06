import { View, Text, Pressable } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button from '../Button'
import StyledModal from '../StyledModal'
import useModal from '../../hooks/useModal'
import { gStyles } from '../../styles'
import {
  CreateCustomerChoiceType,
  useCustomers
} from '../../state/features/costumers/costumersSlice'
import { useEffect, useState } from 'react'
import TextInfo from '../TextInfo'
import OrderType from '../../types/OrderType'
import { customerFromOrder } from './lib/customerFromOrder'
import { CustomerCardE } from './CustomerCard'
import { CustomerType } from '../../state/features/costumers/customerType'
import { useEmployee } from '../../contexts/employeeContext'
import { useOrdersCtx } from '../../contexts/ordersContext'
import { ServiceOrders } from '../../firebase/ServiceOrders'

const ButtonAddCustomer = (props?: ButtonAddCustomerProps) => {
  const { orders } = useOrdersCtx()
  const { handleCreateCustomer } = useCustomers()

  const [order, setOrder] = useState<Partial<OrderType>>(props?.order)

  const modal = useModal({ title: 'Agregar cliente' })
  const { permissions } = useEmployee()

  useEffect(() => {
    if (props?.order) {
      setOrder(props.order)
    } else {
      const ctxOrder = orders?.find((o) => o?.id === props?.orderId)
      if (ctxOrder) {
        setOrder(ctxOrder)
      } else {
        ServiceOrders.get(props.orderId)
          .then((order) => {
            setOrder(order)
          })
          .catch((err) => {
            console.log({ err })
          })
      }
    }
  }, [props?.order, props?.orderId])

  //** CREATE CUSTOMER FROM ORDER
  const customer = customerFromOrder(order)
  console.log({ customer })
  const canCreateCustomer = permissions?.customers?.write
  return (
    <View style={{ marginLeft: 6, justifyContent: 'center' }}>
      <Button
        icon="profileAdd"
        onPress={modal.toggleOpen}
        variant="ghost"
        color="success"
        justIcon
        size="xs"
        disabled={!canCreateCustomer}
      />
      <StyledModal {...modal}>
        <AddOrMergeCustomer
          onSelectOption={async ({ option }) => {
            return await handleCreateCustomer({
              option,
              newCustomer: customer,
              storeId: customer.storeId,
              orderId: customer.orderId
            }).then((res) => {
              modal.toggleOpen()
            })
          }}
          customer={customer}
        />
      </StyledModal>
    </View>
  )
}

export type AddCustomerProps = {
  option: CreateCustomerChoiceType
  customerId?: string
}

export const AddOrMergeCustomer = ({
  customer,
  onSelectOption
}: {
  customer: Partial<CustomerType>
  onSelectOption?: (option: AddCustomerProps) => Promise<void> | void
}) => {
  const [selectedSimilarCustomer, setSelectedSimilarCustomer] =
    useState<CustomerType>(null)

  const handleSelectCustomer = (customerId) => {
    if (selectedSimilarCustomer === customerId) {
      setSelectedSimilarCustomer(null)
    } else {
      setSelectedSimilarCustomer(customerId)
    }
  }
  const [disabled, setDisabled] = useState(false)

  const handleChoice = async (option: CreateCustomerChoiceType) => {
    setDisabled(true)
    await onSelectOption({
      option,
      customerId: selectedSimilarCustomer?.id
    })
    setDisabled(false)
  }
  return (
    <>
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}
        >
          <Button
            label="Cancelar"
            variant="ghost"
            onPress={async () => {
              return await handleChoice('cancel')
            }}
            disabled={disabled}
          />
          {!!selectedSimilarCustomer ? (
            <Button
              label="Agregar "
              icon="merge"
              onPress={async () => {
                return await handleChoice('merge')
              }}
              disabled={disabled}
            />
          ) : (
            <Button
              label="Crear"
              color="success"
              icon="add"
              onPress={async () => {
                return await handleChoice('create')
              }}
              disabled={disabled}
            />
          )}
        </View>
      </View>
    </>
  )
}
export const getSimilarCustomers = (customer, customers) => {
  return customers.filter((c) => {
    const sameName = c.name.toLowerCase() === customer?.name.toLowerCase()
    const someSameContact = Object.values(c.contacts || {}).some((contact) => {
      return Object.values(customer?.contacts || {}).some((contact2) => {
        //@ts-ignore
        return contact.value === contact2.value
      })
    })
    return sameName || someSameContact
  })
}
const SimilarCustomers = ({ customer, onSelectCustomer, selectedCustomer }) => {
  const { data: customers } = useCustomers()

  const [similarCustomers, setSimilarCustomers] = useState([])
  //console.log({ customer, similarCustomers })
  useEffect(() => {
    if (customers.length) {
      const similarCustomers = getSimilarCustomers(customer, customers)
      setSimilarCustomers(similarCustomers)
    }
  }, [])
  return (
    <View>
      <Text style={gStyles.h2}>Clientes con datos similares</Text>
      <SimilarCustomersList
        selectedCustomer={selectedCustomer}
        onSelectCustomer={onSelectCustomer}
        similarCustomers={similarCustomers}
      />
    </View>
  )
}
export const SimilarCustomersList = ({
  similarCustomers,
  onSelectCustomer,
  selectedCustomer
}: {
  similarCustomers: CustomerType[]
  onSelectCustomer: (customer: CustomerType) => void
  selectedCustomer: CustomerType
}) => {
  return (
    <View>
      {similarCustomers
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        })
        .map((c, i) => (
          <Pressable
            key={i}
            onPress={() => onSelectCustomer(c)}
            style={{
              borderWidth: 2,
              borderColor:
                selectedCustomer && selectedCustomer?.id === c?.id
                  ? 'black'
                  : 'transparent',
              borderStyle: 'dashed',
              flexDirection: 'row'
            }}
          >
            <View>
              <Text>{c.name}</Text>
              {Object.values(c.contacts || {}).map((contact, i) => (
                //@ts-ignore
                <Text key={contact.id || i}>{contact.value}</Text>
              ))}
            </View>
            <View>
              <Text>{c?.address?.street}</Text>
              <Text>{c?.address?.neighborhood}</Text>
            </View>
          </Pressable>
        ))}
    </View>
  )
}
export default ButtonAddCustomer
export type ButtonAddCustomerProps = {
  order?: Partial<OrderType>
  toggleModal?: ReturnType<typeof useModal>
  orderId?: string
}
export const ButtonAddCustomerE = (props: ButtonAddCustomerProps) => (
  <ErrorBoundary componentName="ButtonAddCustomer">
    <ButtonAddCustomer {...props} />
  </ErrorBoundary>
)
