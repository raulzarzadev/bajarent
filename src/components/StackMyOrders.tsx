import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrderDetail from './ScreenOrderDetail'
import ScreenNewOrder from './ScreenOrderNew'
import ScreenMyOrders from './ScreenMyOrders'
import MyStaffLabel from './MyStaffLabel'
import ScreenOrderEdit from './ScreenOrderEdit'
import ScreenOrderRenew from './ScreenOrderRenew'
import ScreenOrderReorder from './ScreenOrderReorder'

const Stack = createStackNavigator()

function StackMyOrders() {
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
        name="MyOrders"
        options={{
          title: 'Mis Ordenes'
        }}
        component={ScreenMyOrders}
      />
      <Stack.Screen
        name="OrderDetails"
        options={{
          title: 'Detalle de orden'
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
export default StackMyOrders
