import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from './MyStaffLabel'
import ErrorBoundary from './ErrorBoundary'
import { ScreenStaffE } from './ScreenStaff'
import ScreenStaffNew from './ScreenStaffNew'
import ScreenStaffEdit from './ScreenStaffEdit'

const Stack = createStackNavigator()
function StackStaff() {
  return (
    <Stack.Navigator
      id="StackStaff"
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
          title: `${route?.params?.sectionName || 'Staff'}`
        })}
        component={ScreenStaffE}
      />

      <Stack.Screen
        name="ScreenStaffNew"
        options={{
          title: 'Nuevo staff'
        }}
        component={ScreenStaffNew}
      />

      <Stack.Screen
        name="ScreenStaffEdit"
        options={{
          title: 'Editar staff'
        }}
        component={ScreenStaffEdit}
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
