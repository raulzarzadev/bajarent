import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenProfile from './ScreenProfile'
import ScreenProfileEdit from './ScreenProfileEdit'
import MyStaffLabel from './MyStaffLabel'
import ErrorBoundary from './ErrorBoundary'

const Stack = createStackNavigator()
function StackProfile() {
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
      <ErrorBoundary componentName="Profile">
        <Stack.Screen
          name="Profile"
          options={{
            title: 'Perfil'
          }}
          component={ScreenProfile}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <Stack.Screen
          name="CreateStore"
          options={{
            title: 'Crear tienda'
          }}
          component={ScreenCreateStore}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <Stack.Screen
          name="EditProfile"
          options={{
            title: 'Editar'
          }}
          component={ScreenProfileEdit}
        />
      </ErrorBoundary>
    </Stack.Navigator>
  )
}
export default StackProfile
