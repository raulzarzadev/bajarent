import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import { useOrdersCtx } from '../contexts/ordersContext'
import useOrders from '../hooks/useOrders'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import Loading from './Loading'
import { gStyles } from '../styles'

function ScreenOrders({ route, navigation: { navigate } }) {
  useStore() //*<---- FIXME: if you remove this everything will break

  const hasOrderList = !!route?.params?.orders
  const showRentData = !!route?.params?.showRentData
  const { orders, handleRefresh: refreshOrders } = useOrdersCtx()

  const { orders: preOrders, fetchOrders: refreshPreOrders } = useOrders({
    ids: route?.params?.orders
  })

  const [disabled, setDisabled] = useState(false)
  const handleRefresh = () => {
    setDisabled(true)
    refreshOrders()
    refreshPreOrders()
    setTimeout(() => setDisabled(false), 4000)
  }

  if (orders === undefined)
    return (
      <View
        style={[
          gStyles.container,
          { flexDirection: 'column', justifyContent: 'center' }
        ]}
      >
        <Text
          style={{ textAlign: 'center', marginVertical: 8, fontWeight: 'bold' }}
        >
          Cargando ordenes
        </Text>
        <Loading />
      </View>
    )
  if (orders.length === 0) return <Text>No hay ordenes</Text>
  return (
    <ListOrders
      orders={hasOrderList ? preOrders : orders}
      //defaultOrdersIds={filtered}
      collectionSearch={{
        collectionName: 'orders',
        fields: [
          'folio',
          'note',
          'fullName',
          'name',
          'neighborhood',
          'status',
          'phone'
        ]
      }}
      showTime={showRentData}
      showTotal={showRentData}
      sideButtons={[
        {
          icon: 'refresh',
          label: '',
          onPress: () => {
            handleRefresh()
          },
          visible: true,
          disabled: disabled
        }
      ]}
    />
  )
}

export default ScreenOrders
