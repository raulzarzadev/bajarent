import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from './MyStaffLabel'
import ErrorBoundary from './ErrorBoundary'
import ScreenBalances from './ScreenBalances'
import ScreenBalancesDetails from './ScreenBalancesDetails'
import ScreenBalancesNew from './ScreenBalancesNew'

const Stack = createStackNavigator()
function StackBalances() {
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
        name="ScreenBalances"
        options={{
          title: 'Cortes de caja'
        }}
        component={ScreenBalances}
      />
      <Stack.Screen
        name="ScreenBalancesNew"
        options={{
          title: 'Nuevo corte'
        }}
        component={ScreenBalancesNew}
      />

      <Stack.Screen
        name="ScreenBalancesDetails"
        options={{
          title: 'Detalles de corte'
        }}
        component={ScreenBalancesDetails}
      />
    </Stack.Navigator>
  )
}
export const StackBalancesE = (props) => (
  <ErrorBoundary componentName="StackBalances">
    <StackBalances {...props} />
  </ErrorBoundary>
)
export default StackBalances
