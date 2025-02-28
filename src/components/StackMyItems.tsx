import { createStackNavigator } from '@react-navigation/stack'
import ScreenItemNew from './ScreenItemNew'
import ScreenItemsDetails from './ScreenItemsDetails'
import { ScreenItemEditE } from './ScreenItemEdit'
import ScreenMyItems from './ScreenMyItems'
import StackItems from './StackItems'

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
        name="StackItems"
        options={{
          title: 'Artículos',
          headerShown: false
        }}
        component={StackItems}
      />
      {/* <Stack.Screen
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
      /> */}
    </Stack.Navigator>
  )
}
export default StackMyItems
