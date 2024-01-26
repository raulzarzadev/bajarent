import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenProfile from './ScreenProfile'

const OrdersStack = createStackNavigator()
function StackProfile() {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="Profile"
        options={{
          title: 'Perfil'
        }}
        component={ScreenProfile}
      />
      <OrdersStack.Screen
        name="CreateStore"
        options={{
          title: 'Crear tienda'
        }}
        component={ScreenCreateStore}
      />
    </OrdersStack.Navigator>
  )
}
export default StackProfile
