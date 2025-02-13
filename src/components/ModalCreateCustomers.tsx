import { View, Text, FlatList } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import Button from './Button'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import OrderType from '../types/OrderType'
import { CustomerType } from '../state/features/costumers/customerType'
import { useEffect, useState } from 'react'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ListE } from './List'
import { customerFromOrder } from './Customers/lib/customerFromOrder'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { getSimilarCustomers } from './Customers/ButtonAddCustomer'
import InputCheckbox from './InputCheckbox'
import { useStore } from '../contexts/storeContext'
const ModalCreateCustomers = (props?: ModalCreateCustomersProps) => {
  const selectedOrdersIds = props?.ordersIds
  console.log({ selectedOrdersIds })
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

  return (
    <View>
      <Button label="Create customers" onPress={modal.toggleOpen} />
      <StyledModal {...modal} size="full">
        <Button
          onPress={handleGetSelectedOrders}
          label="Clientes desde ordenes"
        ></Button>
        <ListE
          filters={[]}
          data={fullOrders}
          ComponentRow={({ item }) => <OrderCustomerRow order={item} />}
        />
      </StyledModal>
    </View>
  )
}
export type HandleSetOrdersProps =
  | {
      option: 'merge' // merge-replaceInOrderAndMergeWithSimilar
      customer: Partial<CustomerType>
      orderId: string
    }
  | {
      option: 'create' // create-createNewCustomer
      customer: Partial<CustomerType>
      orderId: string
    }
  | {
      option: 'replace' // replace-InOrder
      customerId: string
      orderId: string
    }
const OrderCustomerRow = ({ order }: { order: OrderType }) => {
  const { data: storeCustomers, create, update } = useCustomers()
  const { storeId } = useStore()
  const orderCustomer = customerFromOrder(order)
  const customerAlreadyExist = storeCustomers.some(
    (customer) => customer.id === orderCustomer.id
  )
  const similarStoreCustomers = getSimilarCustomers(
    orderCustomer,
    storeCustomers
  )

  const [mergeCustomerSelected, setMergeCustomerSelected] =
    useState<string>(null)

  const [similarCustomerSelected, setSimilarCustomerSelected] =
    useState<string>(null)
  const [createCustomerSelected, setCreateCustomerSelected] =
    useState<boolean>(false)

  const handleSelectToReplace = ({
    value,
    customerId
  }: {
    value: boolean
    customerId: string
  }) => {
    if (value) {
      setCreateCustomerSelected(false)
      setMergeCustomerSelected(null)
    }
    setSimilarCustomerSelected(value ? customerId : null)
  }
  const handleCreateCustomer = ({
    value,
    customer
  }: {
    value: boolean
    customer?: Partial<CustomerType>
  }) => {
    if (value) {
      setSimilarCustomerSelected(null)
      setMergeCustomerSelected(null)
    }
    setCreateCustomerSelected(value)
  }

  const handleSelectMerge = ({
    value,
    customerId
  }: {
    value: boolean
    customerId: string
  }) => {
    if (value) {
      setCreateCustomerSelected(false)
      setSimilarCustomerSelected(null)
    }
    setMergeCustomerSelected(value ? customerId : null)
  }

  const [disabled, setDisabled] = useState(false)
  const [done, setDone] = useState(false)
  const handleUpdateOrder = async () => {
    setDisabled(true)
    if (createCustomerSelected) {
      const { payload: createdCustomer } = await create(storeId, orderCustomer)
      //@ts-ignore
      const newCustomerId = createdCustomer?.id
      await ServiceOrders.update(order.id, { customerId: newCustomerId })
      //console.log('create', { orderCustomer, orderId: order.id })
      //create customer
      //update order
    }
    if (similarCustomerSelected) {
      //console.log('update', { similarCustomerSelected, orderId: order.id })
      await ServiceOrders.update(order.id, {
        customerId: similarCustomerSelected
      })
    }
    if (mergeCustomerSelected) {
      //console.log('merge', { mergeCustomerSelected, orderCustomer })
      update(mergeCustomerSelected, orderCustomer)
      await ServiceOrders.update(order.id, {
        customerId: mergeCustomerSelected
      })
      //update customer
      //update order
    }
    setDisabled(false)
    setDone(true)
  }

  const stringCustomerData = (customer: Partial<CustomerType>) =>
    `${Object.values(customer.contacts).length} ${
      Object.values(customer.images).length
    }  ${customer.name} `

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 8,
        width: '100%',
        justifyContent: 'space-between'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          width: 160,
          justifyContent: 'space-between'
        }}
      >
        <Text>
          {customerAlreadyExist
            ? '✅'
            : similarStoreCustomers?.length > 0
            ? '🔄'
            : '⚠️'}
        </Text>
        <Text>
          {order.folio}-{stringCustomerData(orderCustomer)}{' '}
          {/* CREATE NEW USER ? */}
        </Text>
        {!customerAlreadyExist && (
          <InputCheckbox
            iconCheck="add"
            value={createCustomerSelected}
            setValue={(value) => {
              handleCreateCustomer({ value, customer: orderCustomer })
            }}
          />
        )}
      </View>
      <View style={{ width: 'auto', flex: 1, justifyContent: 'flex-start' }}>
        {!customerAlreadyExist &&
          similarStoreCustomers.map((customer) => (
            <Text key={customer.id}>
              <InputCheckbox
                iconCheck="orderAdd"
                value={similarCustomerSelected === customer.id}
                setValue={(value) =>
                  handleSelectToReplace({ value, customerId: customer.id })
                }
              />
              <InputCheckbox
                iconCheck="merge"
                value={mergeCustomerSelected === customer.id}
                setValue={(value) =>
                  handleSelectMerge({ value, customerId: customer.id })
                }
              />
              {stringCustomerData(customer)}
            </Text>
          ))}
      </View>
      <View style={{ width: 160 }}>
        <View>
          <Button
            disabled={
              done ||
              disabled ||
              (!createCustomerSelected &&
                !similarCustomerSelected &&
                !mergeCustomerSelected)
            }
            color={done ? 'success' : 'primary'}
            icon={done ? 'done' : 'save'}
            size="xs"
            label={
              createCustomerSelected
                ? 'Crear '
                : similarCustomerSelected
                ? 'Reemplazar '
                : 'Actualizar '
            }
            onPress={() => {
              handleUpdateOrder()
            }}
          ></Button>
        </View>
      </View>
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
