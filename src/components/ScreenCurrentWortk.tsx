import { View } from 'react-native'
import { ViewCurrentWorkE } from './CurrentWork/ViewCurrentWork'
import ErrorBoundary from './ErrorBoundary'

export const ScreenCurrentWork = () => {
  return (
    <View style={{ marginTop: 12 }}>
      <ViewCurrentWorkE />
    </View>
  )
}

export type ScreenCurrentWorkProps = {}
export const ScreenCurrentWorkE = (props: ScreenCurrentWorkProps) => (
  <ErrorBoundary componentName="ScreenCurrentWork">
    <ScreenCurrentWork {...props} />
  </ErrorBoundary>
)
