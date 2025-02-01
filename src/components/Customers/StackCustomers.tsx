import { createStackNavigator } from '@react-navigation/stack'
import MyStaffLabel from '../MyStaffLabel'
import ErrorBoundary from '../ErrorBoundary'
import { ScreenCustomersE } from './ScreenCustomers'
import { ScreenCustomerE } from './ScreenCustomer'
import ScreenCustomerForm, { ScreenCustomerFormE } from './ScreenCustomerForm'
import ScreenOrderNew from '../ScreenOrderNew'

const Stack = createStackNavigator()
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
        component={ScreenCustomerForm}
      />
    </Stack.Navigator>
  )
}
export const StackCustomersE = (props) => (
  <ErrorBoundary componentName="StackCustomers">
    <StackCustomers {...props} />
  </ErrorBoundary>
)
