import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from './MyStaffLabel'
import ErrorBoundary from './ErrorBoundary'
import ScreenPayments from './ScreenPayments'
import ScreenPaymentsDetails from './ScreenPaymentsDetails'
import StackOrders from './StackOrders'

const Stack = createStackNavigator()
function StackPayments() {
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
        name="ScreenPayments"
        options={({ route }) => ({
          title: 'Pagos'
        })}
        component={ScreenPayments}
      />

      <Stack.Screen
        name="ScreenPaymentsDetails"
        options={{
          title: 'Detalles de pago'
        }}
        component={ScreenPaymentsDetails}
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
