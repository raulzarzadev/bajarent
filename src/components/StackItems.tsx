import { createStackNavigator } from '@react-navigation/stack'
import type { ItemsStackParamList } from '../navigation/types'
import { ScreenItemEditE } from './ScreenItemEdit'
import ScreenItemNew from './ScreenItemNew'
import ScreenItems from './ScreenItems'
import ScreenItemsDetails from './ScreenItemsDetails'

const Stack = createStackNavigator<ItemsStackParamList>()
function StackItems() {
	return (
		<Stack.Navigator
			id="StackItems"
			screenOptions={() => {
				return {
					// headerRight(props) {
					//   return <MyStaffLabel />
					// }
				}
			}}
		>
			<Stack.Screen
				name="ScreenItems"
				options={{
					title: 'Artículos'
				}}
				component={ScreenItems}
			/>

			<Stack.Screen
				name="ScreenItemNew"
				options={{
					title: 'Nuevo artículo'
				}}
				component={ScreenItemNew}
			/>
			<Stack.Screen
				name="ScreenItemsDetails"
				options={{
					title: 'Detalles de artículo'
				}}
				component={ScreenItemsDetails}
			/>

			<Stack.Screen
				name="ScreenItemEdit"
				options={{
					title: 'Editar artículo'
				}}
				component={ScreenItemEditE}
			/>
		</Stack.Navigator>
	)
}
export default StackItems
