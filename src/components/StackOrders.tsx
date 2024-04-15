import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrders from './ScreenOrders'
import ScreenOrderDetail from './ScreenOrderDetail'
import ScreenNewOrder from './ScreenOrderNew'
import ScreenOrderEdit from './ScreenOrderEdit'
import ScreenAssignOrder from './ScreenAssignOrder'
import ScreenOrderRenew from './ScreenOrderRenew'
import MyStaffLabel from './MyStaffLabel'
import ScreenOrderReorder from './ScreenOrderReorder'

const Stack = createStackNavigator()
function StackOrders() {
  return (
    <Stack.Navigator
      screenOptions={() => {
        return {
          headerRight(props) {
            return <MyStaffLabel />
          }
        }
      }}
    >
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

      <Stack.Screen
        name="RenewOrder"
        options={{
          title: 'Renovar Orden'
        }}
        component={ScreenOrderRenew}
      />
      <Stack.Screen
        name="ReorderOrder"
        options={{
          title: 'Re ordenar '
        }}
        component={ScreenOrderReorder}
      />
    </Stack.Navigator>
  )
}
export default StackOrders
