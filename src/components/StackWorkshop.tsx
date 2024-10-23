import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from './ErrorBoundary'
import { ScreenWorkshopE } from './ScreenWorkshop'
import { ScreenWorkshopHistoryE } from './ScreenWorkshopHistory'

const Stack = createStackNavigator()
function StackWorkshop() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Workshop"
        options={({ route }) => ({
          title: 'Taller'
        })}
        component={ScreenWorkshopE}
      />
      <Stack.Screen
        name="WorkshopHistory"
        options={({ route }) => ({
          title: 'Historial de taller'
        })}
        component={ScreenWorkshopHistoryE}
      />
    </Stack.Navigator>
  )
}
export const StackWorkshopE = (props) => (
  <ErrorBoundary componentName="StackWorkshop">
    <StackWorkshop {...props} />
  </ErrorBoundary>
)
export default StackWorkshop
