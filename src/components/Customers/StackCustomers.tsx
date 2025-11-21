import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from '../MyStaffLabel'
import ErrorBoundary from '../ErrorBoundary'
import { ScreenCustomersE } from './ScreenCustomers'
import { ScreenCustomerE } from './ScreenCustomer'
import { ScreenCustomerFormE } from './ScreenCustomerForm'
// import StackOrders from '../StackOrders'

const Stack = createStackNavigator()

const StackOrdersLazy = (props) => {
  const StackOrders = require('../StackOrders').default
  return <StackOrders {...props} />
}

export function StackCustomers() {
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
        name="ScreenCustomers"
        options={({ route }) => ({
          //@ts-ignore
          title: `Clientes`
        })}
        component={ScreenCustomersE}
      />
      <Stack.Screen
        name="ScreenCustomer"
        options={({ route }) => ({
          //@ts-ignore
          title: `Detalles de cliente`
        })}
        component={ScreenCustomerE}
      />
      <Stack.Screen
        name="ScreenCustomerNew"
        options={({ route }) => ({
          //@ts-ignore
          title: `Nuevo cliente`
        })}
        component={ScreenCustomerFormE}
      />
      <Stack.Screen
        name="ScreenCustomerEdit"
        options={({ route }) => ({
          //@ts-ignore
          title: `Editar cliente`
        })}
        component={ScreenCustomerFormE}
      />
      <Stack.Screen
        name="StackOrders"
        component={StackOrdersLazy}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
export const StackCustomersE = (props) => (
  <ErrorBoundary componentName="StackCustomers">
    <StackCustomers {...props} />
  </ErrorBoundary>
)
