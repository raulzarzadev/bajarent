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
import { BusinessStatusE } from './BusinessStatus'
import asDate from '../libs/utils-date'
import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import { BalanceType2 } from '../types/BalanceType'
import { ServiceBalances } from '../firebase/ServiceBalances2'
import Loading from './Loading'
import { ServiceConsolidatedOrders } from '../firebase/ServiceConsolidatedOrders'
import ButtonDownloadCSV from './ButtonDownloadCSV'
import HeaderDate from './HeaderDate'
import StoreCounts from './StoreCounts'
import StoreTabMap from './StoreTabMap'
import DisabledView from './DisabledView'
import TabStoreSections from './TabStoreSections'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'
import ModalCloseOperations from '../ModalCloseOperations'

const ScreenStore = (props) => {
  const { store, user } = useAuth()
  const {
    permissions: {
      isAdmin,
      isOwner,
      orders,
      store: storePermissions,
      canManageItems
    }
  } = useEmployee()
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
  const CheckedTabCashbox = CheckedTab(TabCashbox)
  const CheckedTabStaff = CheckedTab(TabStaff)
  const CheckedTabItems = CheckedTab(TabItems)
  const CheckedTabMap = CheckedTab(StoreTabMap)
  const CheckedTabClients = CheckedTab(TabClients)
  const CheckedTabOrders = CheckedTab(TabOrders)
  const CheckedStoreCounts = CheckedTab(StoreCounts)

  return (
    <ScrollView>
      {/* {!!user && <StoreDetailsE store={store} {...props} />} */}
      {!!user && (
        <Tabs
          tabs={[
            {
              title: 'Información',
              content: <StoreDetailsE store={store} {...props} />,
              show: true,
              icon: 'info'
            },

            {
              title: 'Caja',
              content: <CheckedTabCashbox />,
              show: canViewCashbox,
              icon: 'cashbox'
            },

            {
              title: 'Cuentas',
              content: <CheckedStoreCounts />,
              show: false
            },
            {
              title: 'Ordenes',
              content: <CheckedTabOrders />,
              show: canViewOrders
            },
            {
              title: 'Clientes',
              content: <CheckedTabClients />,
              show: false
            },
            {
              title: 'Movimientos',
              content: <CheckedTabMovements />,
              show: canViewMovements
            },
            {
              title: 'Staff',
              content: <CheckedTabStaff {...props} />,
              show: canViewSections,
              icon: 'profile'
            },
            {
              title: 'Areas',
              content: <CheckedTabSections />,
              show: true,
              icon: 'windows'
            },
            {
              title: 'Artículos',
              content: <CheckedTabItems />,
              show: canManageItems
            },
            {
              title: 'Mapa',
              content: <CheckedTabMap />,
              show: false
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
      <ListMovements />
    </View>
  )
}

const StoreNumbersRow = () => {
  const { store } = useAuth()
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

const TabCashbox = () => {
  const { navigate } = useNavigation()
  const { storeId, storeSections } = useStore()
  const [progress, setProgress] = useState(0)
  const [balance, setBalance] = useState<Partial<BalanceType2>>()

  useEffect(() => {
    handleGetLastBalanceInDate(new Date())
  }, [])

  const handleUpdateStoreStatus = async () => {
    setUpdating(true)
    // ServiceConsolidatedOrders.consolidate(storeId, {
    //   progress: (p) => {
    //     setProgress(p)
    //   }
    // })

    return await ServiceBalances.createV2(storeId, {
      progress: (p) => {
        setProgress(p)
      },
      storeSections: storeSections.map((s) => s.id)
    })
      .then(async (res) => {
        setBalance(res)
        setUpdating(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const [updating, setUpdating] = useState(false)
  // const [date, setDate] = useState(new Date())
  const endOfDay = (date: Date) => asDate(date.setHours(23, 59, 59, 999))

  const handleGetLastBalanceInDate = (date: Date) => {
    ServiceBalances.getLastInDate(storeId, endOfDay(date)).then((res) => {
      setBalance(res[0] || null)
    })
  }

  if (balance === undefined) return <Loading />

  return (
    <ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button
          label="Corte"
          icon="cashbox"
          onPress={() => {
            //@ts-ignore
            navigate('StackBalances', {
              screen: 'ScreenBalancesNew'
            })
          }}
          variant="ghost"
        />
        <Button
          label="Pagos"
          icon="money"
          onPress={() => {
            //@ts-ignore
            navigate('StackPayments')
          }}
          variant="ghost"
        />
        <Button
          label="Retirar"
          icon="moneyOff"
          onPress={() => {
            //@ts-ignore
            navigate('StackPayments', {
              screen: 'ScreenRetirementsNew'
            })
          }}
          variant="ghost"
        />
        <ModalCloseOperations />
      </View>
      <HeaderDate
        debounce={400}
        label="Cuentas"
        onChangeDate={(date) => {
          // setDate(date)
          handleGetLastBalanceInDate(date)
        }}
        documentDate={balance?.createdAt}
      />

      {/* <DateCounts date={date} /> */}
      <View style={{ margin: 'auto', marginVertical: 6 }}>
        <Button
          progress={progress}
          disabled={updating}
          size="small"
          fullWidth={false}
          label="Actualizar"
          icon="refresh"
          onPress={async () => {
            await handleUpdateStoreStatus()
          }}
        />
      </View>
      <BusinessStatusE balance={balance} />
    </ScrollView>
  )
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
