import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OrdersScreen from './ScreenOrders'
import HomeScreen from './ScreenHome'
import OrderDetailScreen from './ScreenOrderDetail'
import NewOrderScreen from './ScreenNewOrder'

const Stack = createNativeStackNavigator()

export default function AppBar() {
  return (
    <>
      <Stack.Navigator>
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen
          name="NewOrder"
          component={NewOrderScreen}
          options={{ title: 'New order' }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailScreen}
          options={{ title: 'Order details' }}
        />
      </Stack.Navigator>
    </>
  )
}
