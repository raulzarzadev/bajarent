import { createStackNavigator } from '@react-navigation/stack'
import ScreenOrderDetail from './ScreenOrderDetail'
import ScreenNewOrder from './ScreenOrderNew'
import ScreenMyOrders from './ScreenMyOrders'
import MyStaffLabel from './MyStaffLabel'

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

      {/* <Stack.Screen
        name="EditOrder"
        options={{
          title: 'Editar Orden'
        }}
        component={ScreenOrderEdit}
      /> */}
      {/* 
      <Stack.Screen
        name="AssignOrder"
        options={{
          title: 'Asignar Orden'
        }}
        component={ScreenAssignOrder}
      /> */}
    </Stack.Navigator>
  )
}
export default StackMyOrders
