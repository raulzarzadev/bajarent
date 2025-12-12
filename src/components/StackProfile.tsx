import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from './MyStaffLabel'
import ScreenProfile from './ScreenProfile'
import ScreenProfileEdit from './ScreenProfileEdit'
import ScreenCreateStore from './ScreenStoreCreate'

const Stack = createStackNavigator()
function StackProfile() {
  return (
    <Stack.Navigator
      id="StackProfile"
      screenOptions={() => {
        return {
          headerRight() {
            return <MyStaffLabel />
          }
        }
      }}
    >
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
