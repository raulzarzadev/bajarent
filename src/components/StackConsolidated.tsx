import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrderDetail, { ScreenOrderDetailE } from './ScreenOrderDetail'
import ScreenOrderEdit from './ScreenOrderEdit'
import ScreenAssignOrder from './ScreenAssignOrder'
import ScreenOrderRenew from './ScreenOrderRenew2'
import MyStaffLabel from './MyStaffLabel'
import ScreenOrderReorder from './ScreenOrderReorder'
import ScreenOrdersConsolidated from './ScreenOrdersConsolidated'
import { StackPaymentsE } from './StackPayments'
import StackItems from './StackItems'

const Stack = createStackNavigator()
function StackConsolidated() {
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
        name="Orders"
        options={({ route }) => ({
          //@ts-ignore
          title: route?.params?.title || 'Ordenes consolidadas' //*<-- Title change if is from pedidos, reportes, balance details and more
        })}
        component={ScreenOrdersConsolidated}
      />

      <Stack.Screen
        name="OrderDetails"
        options={{
          title: 'Detalle de orden'
        }}
        component={ScreenOrderDetailE}
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
    </Stack.Navigator>
  )
}
export default StackConsolidated
