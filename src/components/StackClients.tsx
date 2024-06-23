import { createStackNavigator } from '@react-navigation/stack'
import ScreenClientDetails from './ScreenClientDetails'

const Stack = createStackNavigator()
function StackClients() {
  return (
    <Stack.Navigator
    // screenOptions={() => {
    //   return {
    //     headerRight(props) {
    //       return <MyStaffLabel />
    //     }
    //   }
    // }}
    >
      <Stack.Screen
        name="ScreenClientDetails"
        options={{
          title: 'Detalles de cliente'
        }}
        component={ScreenClientDetails}
      />
    </Stack.Navigator>
  )
}
export default StackClients
