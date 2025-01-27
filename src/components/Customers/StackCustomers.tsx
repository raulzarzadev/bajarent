import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from '../MyStaffLabel'
import ErrorBoundary from '../ErrorBoundary'
import { ScreenCustomersE } from './ScreenCustomers'

const Stack = createStackNavigator()
export function StackCustomers() {
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
        name="ScreenCustomers"
        options={({ route }) => ({
          //@ts-ignore
          title: `Clientes`
        })}
        component={ScreenCustomersE}
      />
    </Stack.Navigator>
  )
}
export const StackCustomersE = (props) => (
  <ErrorBoundary componentName="StackCustomers">
    <StackCustomers {...props} />
  </ErrorBoundary>
)
