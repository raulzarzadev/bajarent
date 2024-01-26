import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrders from './ScreenOrders'
import ScreenOrderDetail from './ScreenOrderDetail'
import ScreenNewOrder from './ScreenNewOrder'
import ScreenOrderEdit from './ScreenOrderEdit'
import ScreenAssignOrder from './ScreenAssignOrder'

const Stack = createStackNavigator()
function StackOrders() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScreenOrders"
        options={{
          title: 'Ordenes'
        }}
        component={ScreenOrders}
      />
      <Stack.Screen
        name="OrderDetails"
        options={{
          title: 'Detalle de  orden'
        }}
        component={ScreenOrderDetail}
      />
      <Stack.Screen
        name="NewOrder"
        options={{
          title: 'Nueva Orden'
        }}
        component={ScreenNewOrder}
      />

      <Stack.Screen
        name="EditOrder"
        options={{
          title: 'Editar Orden'
        }}
        component={ScreenOrderEdit}
      />

      <Stack.Screen
        name="AssignOrder"
        options={{
          title: 'Asignar Orden'
        }}
        component={ScreenAssignOrder}
      />
    </Stack.Navigator>
  )
}
export default StackOrders
