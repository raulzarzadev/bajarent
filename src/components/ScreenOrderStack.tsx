import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrders from './ScreenOrders'
import ScreenOrderDetail from './ScreenOrderDetail'
import FormOrder from './FormOrder'

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
      <OrdersStack.Screen name="OrderDetails" component={ScreenOrderDetail} />
      <OrdersStack.Screen name="NewOrder" component={FormOrder} />
    </OrdersStack.Navigator>
  )
}
export default OrdersStackScreen
