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
import BusinessStatus, { BusinessStatusE } from './BusinessStatus'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import { BalanceType2, Balance_V2 } from '../types/BalanceType'
import { ServiceBalances } from '../firebase/ServiceBalances2'
import Loading from './Loading'
import { ServiceConsolidatedOrders } from '../firebase/ServiceConsolidatedOrders'
import ButtonDownloadCSV from './ButtonDownloadCSV'
import ListClients from './ListClients'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { addDays, subDays } from 'date-fns'
import DateCell from './DateCell'
import HeaderDate from './HeaderDate'
import { set } from 'cypress/types/lodash'

const ScreenStore = (props) => {
  const { store, user } = useAuth()
  const {
    permissions: { isAdmin, isOwner, orders, store: storePermissions }
  } = useEmployee()
  const canViewSections = true
  const canViewOrders = isAdmin || isOwner || orders.canViewAll
  const canViewCashbox = isAdmin || isOwner || storePermissions.canViewCashbox
  const canViewMovements = isAdmin || isOwner || storePermissions.canViewCashbox
  const canViewItems = isAdmin || isOwner || storePermissions.canViewItems

  //&& (canViewCashbox || canViewSections || canViewOrders)
  return (
    <ScrollView>
      {/* {!!user && <StoreDetailsE store={store} {...props} />} */}
      {!!user && (
        <Tabs
          tabs={[
            {
              title: 'Información',
              content: <StoreDetailsE store={store} {...props} />,
              show: true
            },
            {
              title: 'Caja',
              content: <TabCashbox />,
              show: canViewCashbox
            },
            {
              title: 'Ordenes',
              content: <TabOrders />,
              show: canViewOrders
            },
            {
              title: 'Clientes',
              content: <TabClients />,
              show: canViewOrders
            },
            {
              title: 'Movimientos',
              content: <TabMovements />,
              show: canViewMovements
            },
            {
              title: 'Staff',
              content: <TabAreas {...props} />,
              show: canViewSections
            },
            {
              title: 'Artículos',
              content: <TabItems />,
              show: canViewItems
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
  const { storeId } = useStore()
  const [clients, setClients] = useState([])
  useEffect(() => {
    ServiceStoreClients.getAll(storeId).then((res) => {
      setClients(res)
    })
  }, [])
  return (
    <View>
      <ListClients clients={clients} />
    </View>
  )
}

const TabCashbox = () => {
  const { navigate } = useNavigation()
  const { storeId } = useStore()
  const [progress, setProgress] = useState(0)
  const [balance, setBalance] = useState<Partial<BalanceType2>>()

  useEffect(() => {
    handleGetLastBalanceInDate(new Date())
  }, [])

  const handleUpdateStoreStatus = async () => {
    setUpdating(true)
    return await ServiceBalances.createV2(storeId, {
      progress: (p) => {
        setProgress(p)
      }
    })
      .then(async (res) => {
        setBalance(res)
        setUpdating(false)
        await ServiceConsolidatedOrders.consolidate(storeId)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const [updating, setUpdating] = useState(false)

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
      </View>
      <HeaderDate
        debounce={400}
        label="Cuentas"
        onChangeDate={handleGetLastBalanceInDate}
        documentDate={balance?.createdAt}
      />
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

const TabAreas = (props) => {
  const { navigate } = useNavigation()
  return (
    <View>
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
      </View>
      <ScreenStaffE {...props} />
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
