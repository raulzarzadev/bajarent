import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenStore from './ScreenStore'
import ScreenStoreEdit from './ScreenStoreEdit'
import ScreenStaff from './ScreenStaff'
import ScreenStaffNew from './ScreenStaffNew'
import ScreenStaffDetails from './ScreenStaffDetails'
import ScreenStaffEdit from './ScreenStaffEdit'

const Stack = createStackNavigator()
function StackStore() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  )
}
export default StackStore