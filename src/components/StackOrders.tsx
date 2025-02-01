import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrders from './ScreenOrders'
import ScreenOrderDetail from './ScreenOrderDetail'
import ScreenOrderEdit from './ScreenOrderEdit'
import ScreenAssignOrder from './ScreenAssignOrder'
import ScreenOrderRenew from './ScreenOrderRenew2'
import MyStaffLabel from './MyStaffLabel'
import ScreenOrderReorder from './ScreenOrderReorder'
import ScreenOrdersConsolidated from './ScreenOrdersConsolidated'
import { StackPaymentsE } from './StackPayments'
import StackItems from './StackItems'
import { ScreenMessagesE } from './ScreenMessages'
import ScreenOrderNew from './ScreenOrderNew'

const Stack = createStackNavigator()
function StackOrders() {
  return (
    <Stack.Navigator
      screenOptions={(props) => {
        return {
          headerRight(props) {
            return <MyStaffLabel />
          }
        }
      }}
    >
      <Stack.Screen
        name="ScreenOrders"
        options={({ route }) => ({
          //@ts-ignore
          title: route?.params?.title || 'Mis ordenes' //*<-- Title change if is from pedidos, reportes, balance details and more
        })}
        component={ScreenOrders}
      />

      <Stack.Screen
        name="OrderDetails"
        options={{
          title: 'Detalle de orden'
        }}
        component={ScreenOrderDetail}
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

      {/* 
//* Consolidated orders
*/}
      <Stack.Screen
        name="ScreenOrdersConsolidated"
        options={{
          title: 'Ordenes consolidadas'
        }}
        component={ScreenOrdersConsolidated}
      />

      <Stack.Screen
        name="StackPayments"
        options={{
          title: 'Pagos',
          headerShown: false
        }}
        component={StackPaymentsE}
      />

      <Stack.Screen
        name="StackItems"
        options={{
          title: 'Items',
          headerShown: false
          //tabBarButton: () => null
        }}
        component={StackItems}
      />
      <Stack.Screen
        name="ScreenMessages"
        options={({ route }) => ({
          //@ts-ignore
          title: route?.params?.title || 'Mensajería' //*<-- Title change if is from pedidos, reportes, balance details and more
        })}
        component={ScreenMessagesE}
      />
    </Stack.Navigator>
  )
}
export default StackOrders
