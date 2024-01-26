import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenProfile from './ScreenProfile'
import ScreenProfileEdit from './ScreenProfileEdit'

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
      <Stack.Screen
        name="EditProfile"
        options={{
          title: 'Editar'
        }}
        component={ScreenProfileEdit}
      />
    </Stack.Navigator>
  )
}
export default StackProfile
