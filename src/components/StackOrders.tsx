import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrders from './ScreenOrders'
import ScreenOrderDetail from './ScreenOrderDetail'
import ScreenOrderEdit from './ScreenOrderEdit'
import ScreenAssignOrder from './ScreenAssignOrder'
import ScreenOrderRenew from './ScreenOrderRenew'
import MyStaffLabel from './MyStaffLabel'
import ScreenOrderReorder from './ScreenOrderReorder'
import ScreenReports from './ScreenReports'
import ScreenOrdersConsolidated from './ScreenOrdersConsolidated'
import { StackPaymentsE } from './StackPayments'

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
          title: route?.params?.title || 'Ordenes' //*<-- Title change if is from pedidos, reportes, balance details and more
        })}
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
      <Stack.Screen
        name="ScreenReports"
        options={{
          title: 'Reportes'
        }}
        component={ScreenReports}
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
    </Stack.Navigator>
  )
}
export default StackOrders
