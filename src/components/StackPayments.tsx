import { createStackNavigator } from '@react-navigation/stack'
import { PaymentsStackParamList } from '../navigation/types'
import ErrorBoundary from './ErrorBoundary'
import ScreenPayments from './ScreenPayments'
import ScreenPaymentsDetails from './ScreenPaymentsDetails'
import ScreenRetirementsNew from './ScreenRetirementsNew'

const Stack = createStackNavigator<PaymentsStackParamList>()
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
          title: route?.params?.title ?? 'Pagos'
        })}
        component={ScreenPayments}
      />
      <Stack.Screen
        name="ScreenPaymentsDetails"
        options={({ route }) => ({
          title: route?.params?.title ?? 'Detalles de pago'
        })}
        component={ScreenPaymentsDetails}
      />
      <Stack.Screen
        name="ScreenRetirementsNew"
        options={({ route }) => ({
          title: route?.params?.title ?? 'Retiros'
        })}
        component={ScreenRetirementsNew}
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
