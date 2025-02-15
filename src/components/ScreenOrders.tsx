import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import { useOrdersCtx } from '../contexts/ordersContext'
import useOrders from '../hooks/useOrders'
import { useState } from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { ScrollView, Text } from 'react-native'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import useMyNav from '../hooks/useMyNav'
import { useCustomers } from '../state/features/costumers/costumersSlice'

function ScreenOrders({ route, navigation: { navigate } }) {
  const { store } = useStore() //*<---- FIXME: if you remove this everything will break
  const { data } = useCustomers()
  const hasOrderList = !!route?.params?.orders
  const { orders = [], handleRefresh: refreshOrders } = useOrdersCtx()
  const { orders: preOrders, fetchOrders: refreshPreOrders } = useOrders({
    ids: route?.params?.orders
  })

  const [disabled, setDisabled] = useState(false)
  const handleRefresh = () => {
    setDisabled(true)
    refreshOrders()
    refreshPreOrders()
    setTimeout(() => setDisabled(false), 4000)
  }

  const { employee, permissions } = useEmployee()
  const viewAllOrders = permissions.orders.canViewAll
  const userSections = employee?.sectionsAssigned

  const { toMessages } = useMyNav()
  return (
    <ScrollView>
      <ListOrders
        orders={hasOrderList ? preOrders : orders}
        collectionSearch={{
          assignedSections: viewAllOrders ? 'all' : userSections,
          collectionName: 'orders',
          fields: [
            'folio',
            'note',
            'fullName',
            'name',
            'neighborhood',
            'status',
            'phone'
          ]
        }}
        sideButtons={[
          {
            icon: 'refresh',
            label: '',
            onPress: () => {
              handleRefresh()
            },
            visible: true,
            disabled: disabled
          },
          {
            icon: 'comment',
            label: '',
            onPress: () => {
              toMessages()
            },
            visible:
              store?.chatbot?.enabled &&
              (permissions?.isAdmin || permissions?.store?.canSendMessages)
          }
        ]}
      />
    </ScrollView>
  )
}

export default withDisabledCheck(ScreenOrders)
