import { createStackNavigator } from '@react-navigation/stack'
import ErrorBoundary from './ErrorBoundary'
import MyStaffLabel from './MyStaffLabel'
import { ScreenStaffE } from './ScreenStaff'
import ScreenStaffEdit from './ScreenStaffEdit'
import ScreenStaffNew from './ScreenStaffNew'

const Stack = createStackNavigator()
function StackStaff() {
	return (
		<Stack.Navigator
			id="StackStaff"
			screenOptions={() => {
				return {
					headerRight() {
						return <MyStaffLabel />
					}
				}
			}}
		>
			<Stack.Screen
				name="ScreenStaff"
				options={({ route }) => ({
					//@ts-expect-error
					title: `${route?.params?.sectionName || 'Staff'}`
				})}
				component={ScreenStaffE}
			/>

			<Stack.Screen
				name="ScreenStaffNew"
				options={{
					title: 'Nuevo staff'
				}}
				component={ScreenStaffNew}
			/>

			<Stack.Screen
				name="ScreenStaffEdit"
				options={{
					title: 'Editar staff'
				}}
				component={ScreenStaffEdit}
			/>
		</Stack.Navigator>
	)
}
export const StackStaffE = props => (
	<ErrorBoundary componentName="StackStaff">
		<StackStaff {...props} />
	</ErrorBoundary>
)
export default StackStaff
