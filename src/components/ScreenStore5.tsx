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
import useOrders from '../hooks/useOrders'
import { useOrdersCtx } from '../contexts/ordersContext'

const ScreenStore = (props) => {
  const { store, user } = useAuth()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  const canViewOrders = isAdmin || isOwner
  const canViewSections = isAdmin || isOwner
  const canViewCashbox = isAdmin || isOwner
  const canViewStoreNumbers = isAdmin || isOwner

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

const StoreNumbersRow = () => {
  const { store } = useAuth()
  const { navigate } = useNavigation()
  const { orders, reports } = useOrdersCtx()
  //const { orders, comments } = useStore()

  const OrdersAuthorized = orders?.filter(
    (order) => order.status === order_status.AUTHORIZED
  )
  const reportsUnsolved = reports?.filter(
    (comment) => comment.type === 'report' && !comment.solved
  )
  const OrdersReported = reportsUnsolved?.map((comment) => comment.orderId)
  // remove repeated orders
  const OrdersReportedUnique = OrdersReported?.filter(
    (value, index, self) => self.indexOf(value) === index
  )
  const currentFolio = store?.currentFolio

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button
        label={`Folio: ${currentFolio || 0}`}
        onPress={() => {
          console.log('folio')
        }}
        variant="ghost"
        disabled
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
        label={`Reportes: ${reportsUnsolved?.length || 0}`}
        onPress={() => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'ScreenOrders',
            params: {
              title: 'Reportes',
              orders: OrdersReportedUnique
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
          navigate('StackBalances')
        }}
        variant="ghost"
      />
      <Button
        label="Pagos"
        onPress={() => {
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
          console.log('Areas')
          navigate('StackSections')
        }}
        variant="ghost"
        disabled={false}
        icon={'components'}
      />
      <Button
        label="Staff"
        onPress={() => {
          console.log('Staffsss')
          navigate('StackStaff')
        }}
        icon={'orders'}
        variant="ghost"
        disabled={false}
      />
      <Button
        label="Ordenes"
        onPress={() => {
          console.log('Configurar')
        }}
        variant="ghost"
        icon="settings"
        disabled={true}
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
        disabled={true}
        label="Todas"
        onPress={() => {
          console.log('Ver todas')
        }}
        variant="ghost"
      />
      <Button
        label="Configurar"
        onPress={() => {
          console.log('Configurar')

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
