import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenProfile from './ScreenProfile'
import ScreenStore from './ScreenStore'
import ScreenStoreEdit from './ScreenStoreEdit'

const OrdersStack = createStackNavigator()
function StackStore() {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="Store"
        options={{
          title: 'Tienda'
        }}
        component={ScreenStore}
      />
      <OrdersStack.Screen
        name="CreateStore"
        options={{
          title: 'Crear tienda'
        }}
        component={ScreenCreateStore}
      />
      <OrdersStack.Screen
        name="EditStore"
        options={{
          title: 'Editar Tienda'
        }}
        component={ScreenStoreEdit}
      />
    </OrdersStack.Navigator>
  )
}
export default StackStore
