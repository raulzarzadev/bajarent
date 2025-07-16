import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from './MyStaffLabel'
import ScreenOrdersConsolidated from './ScreenOrdersConsolidated'
import { StackPaymentsE } from './StackPayments'
import StackItems from './StackItems'
import StackOrders from './StackOrders'

const Stack = createStackNavigator()
/**
 *
 * @deprecated This stack is deprecated and will be removed in future versions. Use StackOrders instead.
 */
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
        name="StackConsolidated"
        options={({ route }) => ({
          //@ts-ignore
          title: route?.params?.title || 'Ordenes consolidadas' //*<-- Title change if is from pedidos, reportes, balance details and more
        })}
        component={ScreenOrdersConsolidated}
      />

      <Stack.Screen
        name="StackOrders"
        options={{
          title: 'Ordenes',
          headerShown: false
        }}
        component={StackOrders}
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
