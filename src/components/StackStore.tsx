import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenStore from './ScreenStore'
import ScreenStoreEdit from './ScreenStoreEdit'
import ScreenStaff from './ScreenStaff'
import ScreenStaffNew from './ScreenStaffNew'
import ScreenStaffDetails from './ScreenStaffDetails'
import ScreenStaffEdit from './ScreenStaffEdit'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import ScreenStoreSections from './ScreenSections'
import ScreenSectionsNew from './ScreenSectionsNew'
import ScreenSectionsDetails from './ScreenSectionsDetails'
import ScreenSectionsEdit from './ScreenSectionsEdit'
import MyStaffLabel from './MyStaffLabel'
import ScreenItems from './ScreenItems'
import ScreenCategoryEdit from './ScreenCategoryEdit'
import ScreenCategoryNew from './ScreenCategoryNew'

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
function StackStore() {
  return (
    <Stack.Navigator
      screenOptions={() => {
        return {
          headerRight(props) {
            return <MyStaffLabel />
          }
        }
      }}
    >
      <Stack.Screen
        name="Store"
        options={{
          title: 'Tienda'
        }}
        component={ScreenStore}
      />
      <Stack.Screen
        name="CreateStore"
        options={{
          title: 'Crear tienda'
        }}
        component={ScreenCreateStore}
      />

      <Stack.Screen
        name="EditStore"
        options={{
          title: 'Editar Tienda'
        }}
        component={ScreenStoreEdit}
      />

      {/* STAFF */}
      <Stack.Screen
        name="Staff"
        options={{
          title: 'Staff'
        }}
        component={ScreenStaff}
      />
      <Stack.Screen
        name="StaffNew"
        options={{
          title: 'Nuevo Staff'
        }}
        component={ScreenStaffNew}
      />
      <Stack.Screen
        name="StaffDetails"
        options={{
          title: 'Staff Info'
        }}
        component={ScreenStaffDetails}
      />
      <Stack.Screen
        name="StaffEdit"
        options={{
          title: 'Edit staff'
        }}
        component={ScreenStaffEdit}
      />

      {/* SECTIONS  */}
      <Stack.Screen
        name="Areas"
        options={{
          title: 'Areas'
        }}
        component={ScreenStoreSections}
      />
      <Stack.Screen
        name="CreateSection"
        options={{
          title: 'Crear area'
        }}
        component={ScreenSectionsNew}
      />
      <Stack.Screen
        name="SectionDetails"
        options={{
          title: 'Detalles de area'
        }}
        component={ScreenSectionsDetails}
      />
      <Stack.Screen
        name="EditSection"
        options={{
          title: 'Editar area'
        }}
        component={ScreenSectionsEdit}
      />

      {/* ITEMS */}
      <Stack.Screen
        name="Items"
        options={{
          title: 'Artículos'
        }}
        component={ScreenItems}
      />
      {/* CATEGORIES */}

      <Stack.Screen
        name="CreateCategory"
        options={{
          title: 'Crear categoría'
        }}
        component={ScreenCategoryNew}
      />
      <Stack.Screen
        name="EditCategory"
        options={{
          title: 'Editar categoría'
        }}
        component={ScreenCategoryEdit}
      />
    </Stack.Navigator>
  )
}
export default StackStore
