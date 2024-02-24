import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'

function ScreenOrders({ navigation, route }) {
  const { orders } = useStore()
  return <ListOrders orders={orders} />
}

export default ScreenOrders
