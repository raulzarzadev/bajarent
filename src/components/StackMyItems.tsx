import { createStackNavigator } from '@react-navigation/stack'
import type { MyItemsStackParamList } from '../navigation/types'
import ScreenMyItems from './ScreenMyItems'
import StackItems from './StackItems'

const Stack = createStackNavigator<MyItemsStackParamList>()
function StackMyItems() {
	return (
		<Stack.Navigator id="StackMyItems">
			<Stack.Screen
				name="ScreenItems"
				options={{
					title: 'Artículos'
				}}
				component={ScreenMyItems}
			/>

			<Stack.Screen
				name="StackItems"
				options={{
					title: 'Artículos',
					headerShown: false
				}}
				component={StackItems}
			/>
		</Stack.Navigator>
	)
}
export default StackMyItems
