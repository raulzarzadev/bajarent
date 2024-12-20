import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
const SalesBalance = (props: SalesProps) => {
  return (
    <View>
      <Text>Ventas</Text>
    </View>
  )
}
export type SalesProps = {}
export const SalesBalanceE = (props: SalesProps) => (
  <ErrorBoundary componentName="Sales">
    <SalesBalance {...props} />
  </ErrorBoundary>
)
export default SalesBalance
