import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
const RepairsBalance = (props: RepairsBalanceProps) => {
  return (
    <View>
      <Text>Reparaciones</Text>{' '}
    </View>
  )
}
export type RepairsBalanceProps = {}
export const RepairsBalanceE = (props: RepairsBalanceProps) => (
  <ErrorBoundary componentName="RepairsBalance">
    <RepairsBalance {...props} />
  </ErrorBoundary>
)
export default RepairsBalance
