import { ScrollView } from 'react-native'
import { ViewCurrentWorkE } from './CurrentWork/ViewCurrentWork'
import ErrorBoundary from './ErrorBoundary'

export const ScreenCurrentWork = () => {
	return (
		<ScrollView style={{ marginTop: 12 }}>
			<ViewCurrentWorkE />
		</ScrollView>
	)
}

export const ScreenCurrentWorkE = () => (
	<ErrorBoundary componentName="ScreenCurrentWork">
		<ScreenCurrentWork />
	</ErrorBoundary>
)
