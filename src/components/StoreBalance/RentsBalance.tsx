import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
const RentsBalance = (props: RentsBalanceProps) => {
  return (
    <View>
      <Text>Rentas</Text>
    </View>
  )
}
export type RentsBalanceProps = {}
export const RentsBalanceE = (props: RentsBalanceProps) => (
  <ErrorBoundary componentName="RentsBalance">
    <RentsBalance {...props} />
  </ErrorBoundary>
)
export default RentsBalance
