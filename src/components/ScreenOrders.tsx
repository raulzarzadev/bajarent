import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import useOrders from '../hooks/useOrders'
import { useEffect, useState } from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { ScrollView, Text } from 'react-native'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import useMyNav from '../hooks/useMyNav'
import { useOrdersRedux } from '../hooks/useOrdersRedux'

function ScreenOrders({ route, navigation: { navigate } }) {
  const { store } = useStore() //*<---- FIXME: if you remove this everything will break
  const hasOrderList = !!route?.params?.orders
  const {
    forceRefresh,
    //* using unsolved orders its new but im not sure if its the best way
    unsolvedOrders: orders
  } = useOrdersRedux()
  const { fetchOrders } = useOrders({
    ids: route?.params?.orders
  })

  const [preOrders, setPreOrders] = useState([])

  useEffect(() => {
    if (hasOrderList) {
      fetchOrders({ ordersIds: route?.params?.orders })
        .then((res) => {
          setDisabled(false)
          setPreOrders(res)
        })
        .catch((error) => {
          console.error('Error fetching orders:', error)
          setDisabled(false)
        })
    }
  }, [])

  const [disabled, setDisabled] = useState(false)
  const handleRefresh = () => {
    setDisabled(true)
    forceRefresh()
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
          },
          {
            icon: 'folderCheck',
            label: 'Trabajo Actual',
            onPress: () => {
              navigate('StackCurrentWork', {
                screen: 'ScreenCurrentWork',
                params: { title: 'Trabajo Actual' }
              })
            },
            visible: true
          }
        ]}
      />
    </ScrollView>
  )
}

export default withDisabledCheck(ScreenOrders)
