import ErrorBoundary from './ErrorBoundary'
import { ScrollView, View } from 'react-native'
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

const ScreenStore = (props) => {
  const { store, user } = useAuth()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  const canViewOrders = isAdmin || isOwner
  const canViewSections = isAdmin || isOwner
  const canViewCashbox = isAdmin || isOwner
  const canViewStoreNumbers = isAdmin || isOwner
  const canViewMovements = isAdmin || isOwner

  return (
    <ScrollView>
      {user && <StoreDetailsE store={store} {...props} />}
      {user && canViewStoreNumbers && <StoreNumbersRow {...props} />}
      {user && (canViewCashbox || canViewSections || canViewOrders) && (
        <Tabs
          tabs={[
            {
              title: 'Caja',
              content: <TabCashbox />,
              show: canViewCashbox
            },
            {
              title: 'Movimientos',
              content: <TabMovements />,
              show: canViewMovements
            },
            {
              title: 'Areas',
              content: <TabAreas />,
              show: canViewSections
            },
            {
              title: 'Ordenes',
              content: <TabOrders />,
              show: canViewOrders
            },
            {
              title: 'Articulos',
              content: <TabItems />,
              show: true
            }
          ]}
        />
      )}
    </ScrollView>
  )
}

const TabMovements = () => {
  return <ListMovements />
}

const StoreNumbersRow = () => {
  const { store } = useAuth()
  const { navigate } = useNavigation()
  const { orders, reports } = useOrdersCtx()

  const OrdersAuthorized = orders?.filter(
    (order) => order.status === order_status.AUTHORIZED
  )

  const ordersExpired = orders.filter((o) => o.isExpired)

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
        label={`Vencidas: ${ordersExpired?.length}`}
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
        label={`Pedidos: ${OrdersAuthorized?.length}`}
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
            screen: 'ScreenReports',
            params: {
              title: 'Reportes',
              orders: reports.map(({ id }) => id)
            }
          })
        }}
        variant="ghost"
      />
    </View>
  )
}

const TabCashbox = () => {
  const { navigate } = useNavigation()
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button
        label="Cortes"
        onPress={() => {
          //@ts-ignore
          navigate('StackBalances')
        }}
        variant="ghost"
      />
      <Button
        label="Pagos"
        onPress={() => {
          //@ts-ignore
          navigate('StackPayments')
        }}
        variant="ghost"
      />
    </View>
  )
}

const TabAreas = () => {
  const { navigate } = useNavigation()
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button
        label="Areas"
        onPress={() => {
          //@ts-ignore
          navigate('StackSections')
        }}
        variant="ghost"
        disabled={false}
        icon={'components'}
      />
      <Button
        label="Staff"
        onPress={() => {
          //@ts-ignore
          navigate('StackStaff')
        }}
        icon={'orders'}
        variant="ghost"
        disabled={false}
      />
    </View>
  )
}

const TabItems = () => {
  return (
    <View style={[gStyles.container, { marginBottom: gSpace(16) }]}>
      <ScreenItems />
    </View>
  )
}

const TabOrders = () => {
  const { navigate } = useNavigation()
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button
        label="Todas"
        onPress={() => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'ScreenOrders',
            params: {
              title: 'Ordenes',
              orders: [],
              searchInAll: true
            }
          })
        }}
        variant="ghost"
      />
      <Button
        label="Configurar"
        onPress={() => {
          //@ts-ignore
          navigate('ScreenOrdersConfig')
        }}
        variant="ghost"
      />
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
