import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { View } from 'react-native'
import { StoreDetailsE } from './StoreDetails'

const ScreenStore = (props) => {
  const { store } = useStore()
  return (
    <View>
      <StoreDetailsE store={store} {...props} />
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
