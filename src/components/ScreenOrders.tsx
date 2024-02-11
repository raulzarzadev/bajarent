import { useStore } from '../contexts/storeContext'
import OrdersList from './OrdersList'

function ScreenOrders({ navigation }) {
  const { orders } = useStore()

  return (
    <OrdersList
      orders={orders}
      onPressRow={(itemId) => {
        navigation.navigate('OrderDetails', { orderId: itemId })
      }}
    />
  )
}

export default ScreenOrders
