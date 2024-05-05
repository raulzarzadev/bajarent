import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from './MyStaffLabel'
import ErrorBoundary from './ErrorBoundary'
import { ScreenStaffE } from './ScreenStaff'
import ScreenStaffNew from './ScreenStaffNew'
import ScreenStaffDetails from './ScreenStaffDetails'
import ScreenStaffEdit from './ScreenStaffEdit'

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
          title: `${route?.params?.sectionName || ''} staff`
        })}
        component={ScreenStaffE}
      />

      <Stack.Screen
        name="ScreenStaffNew"
        options={{
          title: 'Nuevo Staff'
        }}
        component={ScreenStaffNew}
      />

      <Stack.Screen
        name="ScreenStaffDetails"
        options={{
          title: 'Detalles de Staff '
        }}
        component={ScreenStaffDetails}
      />

      <Stack.Screen
        name="ScreenStaffEdit"
        options={{
          title: 'Edit staff'
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
