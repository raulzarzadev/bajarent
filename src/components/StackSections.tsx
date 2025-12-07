import { createStackNavigator } from '@react-navigation/stack'
import ScreenSections from './ScreenSections'
import ScreenSectionsDetails from './ScreenSectionsDetails'
import ScreenSectionsEdit from './ScreenSectionsEdit'
import ScreenSectionsNew from './ScreenSectionsNew'

export type StackStoreNavigationProps = {
	Store: undefined
	CreateStore: undefined
	EditStore: undefined
	Staff: undefined
	StaffNew: undefined
	StaffDetails: undefined
	StaffEdit: undefined
}

const Stack = createStackNavigator()
function StackSections() {
	return (
		<Stack.Navigator
			id="StackSections"
			screenOptions={() => {
				return {
					//headerShown: false
				}
			}}
		>
			{/* 
      ******************************************** 
            SECTIONS                
      *******************************************rz 
       */}
			<Stack.Screen
				name="ScreenSections"
				options={{
					title: 'Areas'
				}}
				component={ScreenSections}
			/>
			<Stack.Screen
				name="ScreenSectionsNew"
				options={{
					title: 'Crear area'
				}}
				component={ScreenSectionsNew}
			/>
			<Stack.Screen
				name="ScreenSectionsDetails"
				options={{
					title: 'Detalles de area'
				}}
				component={ScreenSectionsDetails}
			/>
			<Stack.Screen
				name="ScreenSectionsEdit"
				options={{
					title: 'Editar area'
				}}
				component={ScreenSectionsEdit}
			/>
		</Stack.Navigator>
	)
}
export default StackSections
