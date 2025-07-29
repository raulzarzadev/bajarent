import { ScrollView, View } from 'react-native'
import { ViewCurrentWorkE } from './CurrentWork/ViewCurrentWork'
import ErrorBoundary from './ErrorBoundary'

export const ScreenCurrentWork = () => {
  return (
    <ScrollView style={{ marginTop: 12 }}>
      <ViewCurrentWorkE />
    </ScrollView>
  )
}

export type ScreenCurrentWorkProps = {}
export const ScreenCurrentWorkE = (props: ScreenCurrentWorkProps) => (
  <ErrorBoundary componentName="ScreenCurrentWork">
    <ScreenCurrentWork {...props} />
  </ErrorBoundary>
)
