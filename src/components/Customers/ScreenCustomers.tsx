import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
const ScreenCustomers = () => {
  return (
    <View>
      <Text>ScreenCustomers</Text>
    </View>
  )
}
export default ScreenCustomers
export type ScreenCustomersProps = {}
export const ScreenCustomersE = (props: ScreenCustomersProps) => (
  <ErrorBoundary componentName="ScreenCustomers">
    <ScreenCustomers {...props} />
  </ErrorBoundary>
)
