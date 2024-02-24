import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import OrdersList from './OrdersList'

function ScreenOrders({ navigation, route }) {
  const { orders } = useStore()
  const filter = route?.params?.orders || []
  const filtered = orders.filter((o) => filter.includes(o.id)).map((o) => o.id)
  return <ListOrders orders={orders} />
}

export default ScreenOrders
