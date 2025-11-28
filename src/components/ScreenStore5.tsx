import ErrorBoundary from './ErrorBoundary'
import { ScrollView, Text, View } from 'react-native'
import { StoreDetailsE } from './StoreDetails'
import Tabs from './Tabs'
import { useEmployee } from '../contexts/employeeContext'
import { useAuth } from '../contexts/authContext'
import ScreenItems from './ScreenItems'
import { gSpace, gStyles } from '../styles'
import ListMovements from './ListMovements'
import { ScreenStaffE } from './ScreenStaff'
import { useRef } from 'react'
import Loading from './Loading'
import DisabledView from './DisabledView'
import TabStoreSections from './TabStoreSections'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import { StoreBalanceE } from './StoreBalance/StoreBalance'
import { CurrentWorkListE } from './CurrentWork/CurrentWorkList'
import { ScreenChatbotE } from './ScreenChatbot'
import { useShop } from '../hooks/useShop'
import { TabStoreConfiguration } from './TabStoreConfigurationt'

const ScreenStore = (props) => {
  const { user } = useAuth()
  const { shop } = useShop()
  const {
    permissions: {
      isAdmin,
      isOwner,
      orders,
      store: storePermissions,
      canManageItems,
      canEditStaff
    }
  } = useEmployee()

  const scrollViewRef = useRef(null)

  const canViewSections = isAdmin || isOwner || canEditStaff
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
  const CheckedTabConfig = CheckedTab(TabStoreConfiguration)
  const CheckedStoreBalance = CheckedTab(StoreBalanceE)

  if (shop === undefined) return <Loading />
  if (shop === null) return <Text>Store not found</Text>
  return (
    <ScrollView ref={scrollViewRef}>
      {!!user && (
        <Tabs
          tabId="screen-store"
          tabs={[
            {
              title: 'Información',
              content: <StoreDetailsE {...props} />,
              show: true,
              icon: 'info'
            },
            {
              title: 'Artículos',
              content: <CheckedTabItems />,
              show: canManageItems,
              icon: 'camera'
            },

            {
              title: 'Balance',
              content: <CheckedStoreBalance />,
              show: canViewCashbox,
              icon: 'balance'
              // icon: 'balance'
            },

            {
              title: 'Staff',
              content: <CheckedTabStaff {...props} />,
              show: canViewSections,
              icon: 'profile'
              //icon: 'profile'
            },
            {
              title: 'Areas',
              content: <CheckedTabSections />,
              show: canViewSections,
              icon: 'list'
              // icon: 'windows'
            },
            {
              title: 'Clientes',
              content: <CheckedTabClients />,
              show: false,
              icon: 'customerCard'
            },
            {
              title: ' Historal',
              content: <CheckedTabMovements />,
              show: canViewMovements,
              icon: 'history'
            },
            {
              title: 'Chatbot',
              content: <ScreenChatbotE />,
              show: isAdmin,
              icon: 'chatbot'
            },
            {
              title: 'Configuración',
              content: <CheckedTabConfig />,
              show: canViewOrders,
              icon: 'settings'
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

export default ScreenStore

export const ScreenStoreE = (props) => {
  return (
    <ErrorBoundary componentName="ScreenStore5">
      <ScreenStore {...props} />
    </ErrorBoundary>
  )
}
