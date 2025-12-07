import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from './ErrorBoundary'
import { ScreenCurrentWorkE } from './ScreenCurrentWortk'

export type StackCurrentWorkNavigationProps = {}

const Stack = createStackNavigator()

function StackCurrentWork() {
	return (
		<Stack.Navigator id="StackCurrentWork">
			<Stack.Screen
				name="ScreenCurrentWork"
				options={{
					title: 'Trabajo Actual'
				}}
				component={ScreenCurrentWorkE}
			/>
		</Stack.Navigator>
	)
}
export default StackCurrentWork
export const StackCurrentWorkE = props => (
	<ErrorBoundary componentName="StackCurrentWork">
		<StackCurrentWork {...props} />
	</ErrorBoundary>
)
