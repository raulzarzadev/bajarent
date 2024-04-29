import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { View } from 'react-native'
import { StoreDetailsE } from './StoreDetails'
import Button from './Button'
import Tabs from './Tabs'
import { useEmployee } from '../contexts/employeeContext2'
import { useAuth } from '../contexts/authContext'
import { order_status } from '../types/OrderType'
import { useNavigation } from '@react-navigation/native'

const ScreenStore = (props) => {
  const { store } = useStore()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  const canViewOrders = isAdmin || isOwner
  const canViewSections = isAdmin || isOwner
  const canViewCashbox = isAdmin || isOwner
  const canViewStoreNumbers = isAdmin || isOwner

  if (!canViewCashbox && !canViewSections && !canViewOrders) return null //<- if have no permissions, return null

  return (
    <View>
      <StoreDetailsE store={store} {...props} />
      {canViewStoreNumbers && <StoreNumbersRow />}
      <Tabs
        tabs={[
          {
            title: 'Ordenes',
            content: <TabOrders />,
            show: canViewOrders
          },
          {
            title: 'Areas',
            content: <TabAreas />,
            show: canViewSections
          },
          {
            title: 'Caja',
            content: <TabCashbox />,
            show: canViewCashbox
          }
        ]}
      />
    </View>
  )
}

const StoreNumbersRow = () => {
  const { store } = useAuth()
  const { orders, comments } = useStore()
  const authorized = orders.filter(
    (order) => order.status === order_status.AUTHORIZED
  )
  const reportsUnsolved = comments.filter(
    (comment) => comment.type === 'report' && !comment.solved
  )
  const currentFolio = store?.currentFolio

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button
        label={`Folio: ${currentFolio}`}
        onPress={() => {
          console.log('folio')
        }}
        variant="ghost"
        disabled
      />
      <Button
        label={`Pedidos: ${authorized.length}`}
        onPress={() => {
          console.log('pedidos')
        }}
        variant="ghost"
      />
      <Button
        label={`Reportes: ${reportsUnsolved.length}`}
        onPress={() => {
          console.log('Reportes')
        }}
        variant="ghost"
      />
    </View>
  )
}

const TabCashbox = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button
        disabled={true}
        label="Cortes"
        onPress={() => {
          console.log('Caja')
        }}
        variant="ghost"
      />
      <Button
        label="Pagos"
        onPress={() => {
          console.log('Pagos')
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

const TabOrders = () => {
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
    <ErrorBoundary componentName="ScreenStore4">
      <ScreenStore {...props} />
    </ErrorBoundary>
  )
}
