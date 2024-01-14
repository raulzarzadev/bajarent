import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OrdersScreen from './OrdersScreen'
import HomeScreen from './HomeScreen'
import OrderDetailScreen from './OrderDetailScreen'

const Stack = createNativeStackNavigator()

export default function AppBar() {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailScreen}
          options={{ title: 'Order details' }}
        />
      </Stack.Navigator>
    </>
  )
}
