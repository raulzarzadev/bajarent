import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenProfile from './ScreenProfile'
import ScreenProfileEdit from './ScreenProfileEdit'
import MyStaffLabel from './MyStaffLabel'
import ErrorBoundary from './ErrorBoundary'

const Stack = createStackNavigator()
function StackStaff() {
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
        name="ScreenStaff"
        options={({ route }) => ({
          //@ts-ignore
          title: `${route?.params?.sectionName} staff`
        })}
        component={ScreenProfile}
      />
      <Stack.Screen
        name="ScreenStaffAdd"
        options={{
          title: 'Agregar staff'
        }}
        component={ScreenCreateStore}
      />
      <Stack.Screen
        name="ScreenStaffDetails"
        options={{
          title: 'Detalles de staff'
        }}
        component={ScreenProfileEdit}
      />
    </Stack.Navigator>
  )
}
export const StackStaffE = (props) => (
  <ErrorBoundary componentName="StackStaff">
    <StackStaff {...props} />
  </ErrorBoundary>
)
export default StackStaff
