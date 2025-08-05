import { Text, View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'

export default function () {
  return (
    <ErrorBoundary>
      <View>
        <Text>Week Orders Timeline</Text>
      </View>
    </ErrorBoundary>
  )
}
