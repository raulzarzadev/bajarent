import { createStackNavigator } from '@react-navigation/stack'
import ScreenClientDetails from './ScreenClientDetails'
import ScreenClientEdit from './ScreenClientEdit'
import ScreenClientNew from './ScreenClientNew'

const Stack = createStackNavigator()
function StackClients() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScreenClientDetails"
        options={{
          title: 'Detalles de cliente'
        }}
        component={ScreenClientDetails}
      />
      <Stack.Screen
        name="ScreenClientEdit"
        options={{
          title: 'Editar cliente'
        }}
        component={ScreenClientEdit}
      />
      <Stack.Screen
        name="ScreenClientNew"
        options={{
          title: 'Nuevo cliente'
        }}
        component={ScreenClientNew}
      />
    </Stack.Navigator>
  )
}
export default StackClients
