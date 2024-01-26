import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenProfile from './ScreenProfile'

const Stack = createStackNavigator()
function StackProfile() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        options={{
          title: 'Perfil'
        }}
        component={ScreenProfile}
      />
      <Stack.Screen
        name="CreateStore"
        options={{
          title: 'Crear tienda'
        }}
        component={ScreenCreateStore}
      />
    </Stack.Navigator>
  )
}
export default StackProfile
