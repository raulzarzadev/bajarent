import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'

function ScreenMyOrders({ navigation }) {
  const { myOrders } = useStore()

  return (
    <>
      <ListOrders orders={myOrders} />
    </>
  )
}

export default ScreenMyOrders
