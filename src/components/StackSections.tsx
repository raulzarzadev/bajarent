import { createStackNavigator } from '@react-navigation/stack'
import ScreenStaff from './ScreenStaff'
import ScreenStaffNew from './ScreenStaffNew'
import ScreenStaffDetails from './ScreenStaffDetails'
import ScreenStaffEdit from './ScreenStaffEdit'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import ScreenSections from './ScreenSections'
import ScreenSectionsNew from './ScreenSectionsNew'
import ScreenSectionsDetails from './ScreenSectionsDetails'
import ScreenSectionsEdit from './ScreenSectionsEdit'

export type StackStoreNavigationProps = {
  Store: undefined
  CreateStore: undefined
  EditStore: undefined
  Staff: undefined
  StaffNew: undefined
  StaffDetails: undefined
  StaffEdit: undefined
}
export const useStoreNavigation = () => {
  const navigation = useNavigation<NavigationProp<StackStoreNavigationProps>>()
  return navigation
}

const Stack = createStackNavigator()
function StackSections() {
  return (
    <Stack.Navigator
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
      {/* 
      ******************************************** 
            STAFF                
      *******************************************rz 
       */}
      <Stack.Screen
        name="ScreenStaff"
        options={{
          title: 'Staff'
        }}
        component={ScreenStaff}
      />
      <Stack.Screen
        name="ScreenStaffNew"
        options={{
          title: 'Nuevo Staff'
        }}
        component={ScreenStaffNew}
      />
      <Stack.Screen
        name="ScreenStaffDetails"
        options={{
          title: 'Detalles de Staff '
        }}
        component={ScreenStaffDetails}
      />
      <Stack.Screen
        name="ScreenStaffEdit"
        options={{
          title: 'Edit staff'
        }}
        component={ScreenStaffEdit}
      />
    </Stack.Navigator>
  )
}
export default StackSections
