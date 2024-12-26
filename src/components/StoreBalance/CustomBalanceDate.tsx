import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
const CustomBalanceDate = () => {
  return (
    <View>
      <Text>CustomBalanceDate</Text>
    </View>
  )
}
export default CustomBalanceDate

export type CustomBalanceDateProps = {}
export const CustomBalanceDateE = (props: CustomBalanceDateProps) => (
  <ErrorBoundary componentName="CustomBalanceDate">
    <CustomBalanceDate {...props} />
  </ErrorBoundary>
)
