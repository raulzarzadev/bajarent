import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import { ScreenOrdersConfigE } from './ScreenOrdersConfig'
import Tabs from './Tabs'
import { useEmployee } from '../contexts/employeeContext'
import ButtonDownloadCSV from './ButtonDownloadCSV'
import Button from './Button'
import { AppErrorLogs } from './StoreBalance/AppErrorLogs'
import { useAuth } from '../contexts/authContext'

export const TabStoreConfiguration = () => {
  const { user } = useAuth()
  return (
    <Tabs
      tabId="tab-store-config"
      tabs={[
        {
          title: 'Ordenes',
          content: <ScreenOrdersConfigE />,
          show: true,
          icon: 'orders'
        },
        {
          title: 'Respaldos',
          content: <BackupsTab />,
          show: true,
          icon: 'backup'
        },
        {
          title: 'Errores',
          content: <AppErrorLogs />,
          show: !!user?.roles?.includes('SUPER_ADMIN')
        }
      ]}
    ></Tabs>
  )
}

export type TabStoreConfigurationProps = {}
export const TabStoreConfigurationE = (props: TabStoreConfigurationProps) => (
  <ErrorBoundary componentName="TabStoreConfiguration">
    <TabStoreConfiguration {...props} />
  </ErrorBoundary>
)

const BackupsTab = () => {
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  return (
    <View style={{ padding: 16, maxWidth: 600, margin: 'auto' }}>
      <ButtonDownloadCSV />
    </View>
  )
}

// const TabConfig = () => {
//   const { navigate } = useNavigation()
//   const {
//     permissions: { isAdmin, isOwner }
//   } = useEmployee()
//   return (
//     <View>
//       <StoreNumbersRow />
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-around',
//           flexWrap: 'wrap'
//         }}
//       >
//         {isAdmin || isOwner ? (
//           <>
//             <Button
//               label="Configurar"
//               onPress={() => {
//                 //@ts-ignore
//                 navigate('ScreenOrdersConfig')
//               }}
//               icon="settings"
//               variant="ghost"
//             />
//             <ButtonDownloadCSV />
//           </>
//         ) : null}
//       </View>
//     </View>
//   )
// }

// const StoreNumbersRow = () => {
//   const { store } = useStore()
//   const { navigate } = useNavigation()
//   const { orders, reports } = useOrdersCtx()

//   const OrdersAuthorized = orders?.filter(
//     (order) => order.status === order_status.AUTHORIZED
//   )

//   const ordersExpired = orders?.filter((o) => o.isExpired)

//   const currentFolio = store?.currentFolio
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         flexWrap: 'wrap'
//       }}
//     >
//       <Button
//         label={`Folio: ${currentFolio || 0}`}
//         onPress={() => {
//           console.log('folio')
//         }}
//         variant="ghost"
//         disabled
//       />
//       <Button
//         label={`Vencidas: ${ordersExpired?.length || 0}`}
//         onPress={() => {
//           //@ts-ignore
//           navigate('StackOrders', {
//             screen: 'ScreenOrders',
//             params: {
//               title: 'Vencidas',
//               orders: ordersExpired?.map(({ id }) => id)
//             }
//           })
//         }}
//         variant="ghost"
//       />
//       <Button
//         label={`Pedidos: ${OrdersAuthorized?.length || 0}`}
//         onPress={() => {
//           //@ts-ignore
//           navigate('StackOrders', {
//             screen: 'ScreenOrders',
//             params: {
//               title: 'Pedidos',
//               orders: OrdersAuthorized?.map(({ id }) => id)
//             }
//           })
//         }}
//         variant="ghost"
//       />
//       <Button
//         label={`Reportes: ${reports?.length || 0}`}
//         onPress={() => {
//           //@ts-ignore
//           navigate('StackOrders', {
//             screen: 'ScreenOrders',
//             params: {
//               title: 'Reportes',
//               orders: reports.map(({ id, orderId }) => orderId)
//             }
//           })
//         }}
//         variant="ghost"
//       />
//     </View>
//   )
// }
