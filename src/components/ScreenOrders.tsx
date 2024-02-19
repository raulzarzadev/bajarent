import { useStore } from '../contexts/storeContext'
import OrdersList from './OrdersList'

function ScreenOrders({ navigation, route }) {
  const { orders } = useStore()
  const filter = route?.params?.orders || []
  const filtered = orders.filter((o) => filter.includes(o.id)).map((o) => o.id)
  return (
    <OrdersList
      defaultOrders={filtered}
      orders={orders}
      onPressRow={(itemId) => {
        navigation.navigate('OrderDetails', { orderId: itemId })
      }}
    />
  )
}

export default ScreenOrders
