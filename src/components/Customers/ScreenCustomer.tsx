import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
const ScreenCustomer = () => {
  return (
    <View>
      <Text>ScreenCustomer</Text>
    </View>
  )
}
export default ScreenCustomer
export type ScreenCustomerProps = {}
export const ScreenCustomerE = (props: ScreenCustomerProps) => (
  <ErrorBoundary componentName="ScreenCustomer">
    <ScreenCustomer {...props} />
  </ErrorBoundary>
)
