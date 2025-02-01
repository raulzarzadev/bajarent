import { Text, View } from 'react-native'
import { ListE } from './List'
import ListRow from './ListRow'
import useMyNav from '../hooks/useMyNav'
import { useCustomers } from '../state/features/costumers/costumersSlice'
import { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { ConsolidateCustomersList } from './ListOrdersConsolidated'
export type ListCustomerType = {
  id: string
  name: string
  contact: string
  neighborhood: string
  street: string
  // status: string
}
const ListCustomers = () => {
  const { data: customers } = useCustomers()
  const [formattedCustomers, setFormattedCustomers] = useState<
    ListCustomerType[]
  >([])
  useEffect(() => {
    if (customers.length) {
      const formatted = customers.map((customer) => {
        const contactsArray = Object.values(customer.contacts || {})
        const contact =
          contactsArray.find((contact) => contact.type === 'phone')?.value ||
          contactsArray[0]?.value
        return {
          id: customer?.id,
          name: customer?.name,
          contact,
          neighborhood: customer?.address?.neighborhood || '',
          street: customer?.address?.street || ''
        }
      })
      setFormattedCustomers(formatted)
    }
  }, [customers])

  const { toCustomers } = useMyNav()
  const modalConsolidatedList = useModal({ title: 'Ordenes consolidadas' })
  return (
    <View>
      <ListE
        rowsPerPage={20}
        sideButtons={[
          {
            icon: 'customerCard',
            label: 'Tarjeta de Cliente',
            onPress: () => {
              modalConsolidatedList.toggleOpen()
            },
            visible: true
          },
          {
            icon: 'add',
            label: 'Nuevo Cliente',
            onPress: () => {
              //@ts-ignore
              toCustomers({ to: 'new' })
            },
            visible: true
          }
        ]}
        defaultOrder="asc"
        defaultSortBy="name"
        sortFields={[
          {
            key: 'name',
            label: 'Nombre'
          },
          {
            key: 'phone',
            label: 'Telefono'
          },
          {
            key: 'neighborhood',
            label: 'Colonia'
          },
          {
            key: 'street',
            label: 'Calle'
          }
        ]}
        filters={[]}
        data={formattedCustomers}
        ComponentRow={({ item }) => <RowClient customer={item} />}
        onPressRow={(id) => {
          toCustomers({ to: 'details', id })
        }}
      />
      <StyledModal {...modalConsolidatedList}>
        <ConsolidateCustomersList />
      </StyledModal>
    </View>
  )
}
const RowClient = ({ customer }: { customer: ListCustomerType }) => {
  return (
    <ListRow
      fields={[
        {
          component: <Text>{customer?.name}</Text>,
          width: 'rest'
        },
        {
          component: <Text>{customer?.contact}</Text>,
          width: 'rest'
        },
        {
          component: <Text>{customer?.neighborhood}</Text>,
          width: 'rest'
        },
        {
          component: <Text>{customer?.street}</Text>,
          width: 'rest'
        }
      ]}
    />
  )
}

export default ListCustomers

export type ListCustomersProps = {}
export const ListCustomersE = (props: ListCustomersProps) => (
  <ErrorBoundary componentName="ListCustomers">
    <ListCustomers {...props} />
  </ErrorBoundary>
)
