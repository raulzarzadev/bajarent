import { StyleSheet, Text, View } from 'react-native'
import { ListE } from './List'
import ListRow from './ListRow'
import useMyNav from '../hooks/useMyNav'
import { CustomerType } from '../state/features/costumers/customerType'

const ListCustomers = ({ customers }: { customers: CustomerType[] }) => {
  const { toCustomers } = useMyNav()
  return (
    <View>
      <ListE
        rowsPerPage={20}
        sideButtons={[
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
            key: 'address',
            label: 'Dirección'
          },
          {
            key: 'status',
            label: 'Estatus'
          }
        ]}
        filters={[]}
        data={customers}
        ComponentRow={({ item }) => <RowClient customer={item} />}
        onPressRow={(id) => {
          toCustomers({ to: 'details', id })
        }}
      />
    </View>
  )
}
const RowClient = ({ customer }: { customer: CustomerType }) => {
  return (
    <ListRow
      fields={[
        {
          component: (
            <View>
              <Text>{customer?.name}</Text>
            </View>
          ),
          width: 'rest'
        },
        {
          component: <View>{/* <Text>{customer}</Text> */}</View>,
          width: 'rest'
        },
        {
          component: <View>{/* <Text>{client?.neighborhood}</Text> */}</View>,
          width: 'rest'
        },
        {
          component: <View>{/* <Text>{client?.address}</Text> */}</View>,
          width: 'rest'
        },
        {
          component: <View>{/* <Text>{client?.status}</Text> */}</View>,
          width: 'rest'
        }
      ]}
    />
  )
}

export default ListCustomers

const styles = StyleSheet.create({})
