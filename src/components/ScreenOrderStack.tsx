import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrders from './ScreenOrders'
import ScreenOrderDetail from './ScreenOrderDetail'
import ScreenNewOrder from './ScreenNewOrder'

const OrdersStack = createStackNavigator()
function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="ScreenOrders"
        options={{
          title: 'Ordenes'
        }}
        component={ScreenOrders}
      />
      <OrdersStack.Screen
        name="OrderDetails"
        options={{
          title: 'Detalle de  orden'
        }}
        component={ScreenOrderDetail}
      />
      <OrdersStack.Screen
        name="NewOrder"
        options={{
          title: 'Nueva Orden'
        }}
        component={ScreenNewOrder}
      />
    </OrdersStack.Navigator>
  )
}
export default OrdersStackScreen
