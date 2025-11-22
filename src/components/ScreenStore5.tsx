import ErrorBoundary from './ErrorBoundary'
import { ScrollView, Text, View } from 'react-native'
import { StoreDetailsE } from './StoreDetails'
import Button from './Button'
import Tabs from './Tabs'
import { useEmployee } from '../contexts/employeeContext'
import { useAuth } from '../contexts/authContext'
import { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'
import ScreenItems from './ScreenItems'
import { gSpace, gStyles } from '../styles'
import { useOrdersCtx } from '../contexts/ordersContext'
import ListMovements from './ListMovements'
import { ScreenStaffE } from './ScreenStaff'
import { useRef } from 'react'
import { useStore } from '../contexts/storeContext'
import Loading from './Loading'
import ButtonDownloadCSV from './ButtonDownloadCSV'
import DisabledView from './DisabledView'
import TabStoreSections from './TabStoreSections'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import { StoreBalanceE } from './StoreBalance/StoreBalance'
import { CurrentWorkListE } from './CurrentWork/CurrentWorkList'
import { ScreenChatbotE } from './ScreenChatbot'

const ScreenStore = (props) => {
  const { user } = useAuth()
  const { store } = useStore()
  const {
    permissions: {
      isAdmin,
      isOwner,
      orders,
      store: storePermissions,
      canManageItems
    }
  } = useEmployee()

  const scrollViewRef = useRef(null)

  const canViewSections = true
  const canViewOrders = isAdmin || isOwner || orders.canViewAll
  const canViewCashbox = isAdmin || isOwner || storePermissions.canViewCashbox
  const canViewMovements = isAdmin || isOwner || storePermissions.canViewCashbox

  //&& (canViewCashbox || canViewSections || canViewOrders)
  const CheckedTab = <P extends object>(Tab: React.ComponentType<P>) => {
    const Component = withDisabledCheck(Tab)
    return Component
  }

  const CheckedTabMovements = CheckedTab(TabMovements)
  const CheckedTabSections = CheckedTab(TabStoreSections)
  const CheckedTabStaff = CheckedTab(TabStaff)
  const CheckedTabItems = CheckedTab(TabItems)
  const CheckedTabClients = CheckedTab(TabClients)
  const CheckedTabOrders = CheckedTab(TabOrders)
  const CheckedStoreBalance = CheckedTab(StoreBalanceE)

  if (store === undefined) return <Loading />
  if (store === null) return <Text>Store not found</Text>
  return (
    <ScrollView ref={scrollViewRef}>
      {!!user && (
        <Tabs
          tabId="screen-store"
          tabs={[
            {
              title: 'ℹ️Información',
              content: <StoreDetailsE {...props} />,
              show: true
              // icon: 'info'
            },
            {
              title: '🧰Artículos',
              content: <CheckedTabItems />,
              show: canManageItems
            },

            {
              title: '⚖️Balance',
              content: <CheckedStoreBalance />,
              show: canViewCashbox
              // icon: 'balance'
            },

            {
              title: '👷‍♂️Staff',
              content: <CheckedTabStaff {...props} />,
              show: canViewSections
              //icon: 'profile'
            },
            {
              title: '🧑‍🧑‍🧒‍🧒Areas',
              content: <CheckedTabSections />,
              show: true
              // icon: 'windows'
            },
            {
              title: '👤Clientes',
              content: <CheckedTabClients />,
              show: false
            },
            {
              title: '📋Historal',
              content: <CheckedTabMovements />,
              show: canViewMovements
            },
            {
              title: '🤖Chatbot',
              content: <ScreenChatbotE />,
              show: isAdmin
            },
            {
              title: '⚙️Ordenes',
              content: <CheckedTabOrders />,
              show: canViewOrders
            }
          ]}
        />
      )}
    </ScrollView>
  )
}

const TabMovements = () => {
  return (
    <View>
      <CurrentWorkListE />
      <ListMovements />
    </View>
  )
}

const StoreNumbersRow = () => {
  const { store } = useStore()
  const { navigate } = useNavigation()
  const { orders, reports } = useOrdersCtx()

  const OrdersAuthorized = orders?.filter(
    (order) => order.status === order_status.AUTHORIZED
  )

  const ordersExpired = orders?.filter((o) => o.isExpired)

  const currentFolio = store?.currentFolio
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
      }}
    >
      <Button
        label={`Folio: ${currentFolio || 0}`}
        onPress={() => {
          console.log('folio')
        }}
        variant="ghost"
        disabled
      />
      <Button
        label={`Vencidas: ${ordersExpired?.length || 0}`}
        onPress={() => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'ScreenOrders',
            params: {
              title: 'Vencidas',
              orders: ordersExpired?.map(({ id }) => id)
            }
          })
        }}
        variant="ghost"
      />
      <Button
        label={`Pedidos: ${OrdersAuthorized?.length || 0}`}
        onPress={() => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'ScreenOrders',
            params: {
              title: 'Pedidos',
              orders: OrdersAuthorized?.map(({ id }) => id)
            }
          })
        }}
        variant="ghost"
      />
      <Button
        label={`Reportes: ${reports?.length || 0}`}
        onPress={() => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'ScreenOrders',
            params: {
              title: 'Reportes',
              orders: reports.map(({ id, orderId }) => orderId)
            }
          })
        }}
        variant="ghost"
      />
    </View>
  )
}

const TabClients = () => {
  return <DisabledView />
}

const TabStaff = (props) => {
  return (
    <View>
      <ScreenStaffE {...props} />
    </View>
  )
}

const TabItems = () => {
  return (
    <View
      style={[gStyles.container, { marginBottom: gSpace(16), maxWidth: 1200 }]}
    >
      <ScreenItems />
    </View>
  )
}

const TabOrders = () => {
  const { navigate } = useNavigation()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  return (
    <View>
      {<StoreNumbersRow />}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap'
        }}
      >
        <Button
          label="Consolidadas"
          onPress={() => {
            //@ts-ignore
            navigate('StackOrders', {
              screen: 'ScreenOrdersConsolidated',
              params: {}
            })
          }}
          variant="ghost"
        />
        {isAdmin || isOwner ? (
          <>
            <Button
              label="Configurar"
              onPress={() => {
                //@ts-ignore
                navigate('ScreenOrdersConfig')
              }}
              icon="settings"
              variant="ghost"
            />
            <ButtonDownloadCSV />
          </>
        ) : null}
      </View>
    </View>
  )
}

export default ScreenStore

export const ScreenStoreE = (props) => {
  return (
    <ErrorBoundary componentName="ScreenStore5">
      <ScreenStore {...props} />
    </ErrorBoundary>
  )
}
