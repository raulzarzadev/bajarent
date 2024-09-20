import { createStackNavigator } from '@react-navigation/stack'
import ScreenItemNew from './ScreenItemNew'
import ScreenItemsDetails from './ScreenItemsDetails'
import { ScreenItemEditE } from './ScreenItemEdit'
import ScreenMyItems from './ScreenMyItems'

const Stack = createStackNavigator()
function StackMyItems() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScreenItems"
        options={{
          title: 'Artículos'
        }}
        component={ScreenMyItems}
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
export default StackMyItems
