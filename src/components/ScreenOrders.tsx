import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import { useOrdersCtx } from '../contexts/ordersContext'
import useOrders from '../hooks/useOrders'
import { useState } from 'react'
import { ListAssignedItemsE } from './ListAssignedItems'

function ScreenOrders({ route, navigation: { navigate } }) {
  useStore() //*<---- FIXME: if you remove this everything will break

  const hasOrderList = !!route?.params?.orders
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

  return (
    <>
      <ListOrders
        orders={hasOrderList ? preOrders : orders}
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
    </>
  )
}

export default ScreenOrders
