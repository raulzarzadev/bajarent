import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from './ErrorBoundary'
import ScreenPayments from './ScreenPayments'
import ScreenPaymentsDetails from './ScreenPaymentsDetails'

const Stack = createStackNavigator()
function StackPayments() {
  return (
    <Stack.Navigator
      screenOptions={() => {
        return {
          // headerRight(props) { //*<-- Dont show in stack payments
          //   return <MyStaffLabel />
          // }
        }
      }}
    >
      <Stack.Screen
        name="ScreenPayments"
        options={({ route }) => ({
          //@ts-ignore
          title: route?.params?.title || 'Pagos'
        })}
        component={ScreenPayments}
      />
    </Stack.Navigator>
  )
}
export const StackPaymentsE = (props) => (
  <ErrorBoundary componentName="StackPayments">
    <StackPayments {...props} />
  </ErrorBoundary>
)
export default StackPayments
