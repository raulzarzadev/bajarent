import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
const GeneralBalance = () => {
  return (
    <View>
      <Text>GeneralBalance</Text>
    </View>
  )
}
export type GeneralBalanceProps = {}
export const GeneralBalanceE = (props: GeneralBalanceProps) => (
  <ErrorBoundary componentName="GeneralBalance">
    <GeneralBalance {...props} />
  </ErrorBoundary>
)
export default GeneralBalance
