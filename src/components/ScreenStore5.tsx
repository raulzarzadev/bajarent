import { useStore } from '../contexts/storeContext'
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
  //const { orders, comments } = useStore()
  const orders = []
  const comments = []

  const OrdersAuthorized = orders?.filter(
    (order) => order.status === order_status.AUTHORIZED
  )
  const reportsUnsolved = comments?.filter(
    (comment) => comment.type === 'report' && !comment.solved
  )
  const OrdersReported = reportsUnsolved?.map((comment) =>
    orders.find((o) => o.id === comment.orderId)
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
              orders: OrdersReported?.map(({ id }) => id)
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

// const TabsStore = (props) => {
//   const { store } = useStore()
//   const {
//     permissions: { isAdmin, isOwner, store: storePermissions }
//   } = useEmployee()
//   const canViewCashbox = isAdmin || isOwner || storePermissions?.canViewCashbox
//   const canViewItems = isAdmin || isOwner || storePermissions?.canViewItems
//   return (
//     <Tabs
//       tabs={[
//         {
//           title: 'Caja',
//           content: <ScreenCashbox {...props} />,
//           show: isAdmin || isOwner || canViewCashbox
//         },
//         {
//           title: 'Articulos',
//           content: <ScreenItems {...props} />,
//           show: isAdmin || isOwner || canViewItems
//         },
//         {
//           title: 'Staff',
//           content: <ScreenStaff {...props} />,
//           show: store?.allowStaff || isAdmin || isOwner
//         },
//         {
//           title: 'Areas',
//           content: <ScreenSections {...props} />,
//           show: store?.allowSections || isAdmin || isOwner
//         },
//         {
//           title: 'Config',
//           content: <StoreDetails store={store} {...props} />,
//           show: isAdmin || isOwner
//         }
//       ]}
//     />
//   )
// }

// const TabsBusiness = (props) => {
//   const {
//     permissions: { isAdmin, isOwner }
//   } = useEmployee()

//   const canViewComments = isAdmin || isOwner
//   const canViewClients = isAdmin || isOwner
//   const canViewItemsStats = isAdmin || isOwner
//   const canViewStoreStats = isAdmin || isOwner

//   return (
//     <Tabs
//       defaultTab="Comentarios"
//       tabs={[
//         {
//           title: 'Comentarios',
//           content: <ScreenComments {...props} />,
//           show: canViewComments
//         },
//         {
//           title: 'Clientes',
//           content: (
//             <View>
//               <Text>Próximamente</Text>
//             </View>
//           ),
//           show: canViewClients
//         },
//         {
//           title: 'Artículos',
//           content: <ScreenItemsStatus {...props} />,
//           show: canViewItemsStats
//         },
//         {
//           title: 'Estadisticas',
//           content: <Stats {...props} />,
//           show: canViewStoreStats
//         }
//       ]}
//     />
//   )
// }

export default ScreenStore

export const ScreenStoreE = (props) => {
  return (
    <ErrorBoundary componentName="ScreenStore5">
      <ScreenStore {...props} />
    </ErrorBoundary>
  )
}
