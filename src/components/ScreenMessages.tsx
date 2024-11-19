import { View, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
export default function ScreenMessages() {
  return (
    <View>
      <Text>ScreenMessages</Text>
    </View>
  )
}
export type ScreenMessagesProps = {}
export const ScreenMessagesE = (props: ScreenMessagesProps) => (
  <ErrorBoundary componentName="ScreenMessages">
    <ScreenMessages {...props} />
  </ErrorBoundary>
)
