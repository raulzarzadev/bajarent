import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenStoreEdit from './ScreenStoreEdit'
import MyStaffLabel from './MyStaffLabel'
import ScreenItems from './ScreenItems'
import ScreenCategoryEdit from './ScreenCategoryEdit'
import ScreenCategoryNew from './ScreenCategoryNew'
import StackSections from './StackSections'
import StackStaff from './StackStaff'
import { ScreenStoreE } from './ScreenStore5'
import ScreenOrdersConfig from './ScreenOrdersConfig'
import { StackBalancesE } from './StackBalances'
import StackOrders from './StackOrders'
import { StackPaymentsE } from './StackPayments'
import ScreenItemsMap from './ScreenItemsMap'
import ErrorBoundary from './ErrorBoundary'
import ScreenItemNew from './ScreenItemNew'
import ScreenItemsDetails from './ScreenItemsDetails'
import ScreenItemEdit, { ScreenItemEditE } from './ScreenItemEdit'
import StackClients from './StackClients'
import StackItems from './StackItems'

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
        component={ScreenStoreE}
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
          title: 'Configurar tienda'
        }}
        component={ScreenStoreEdit}
      />

      <Stack.Screen
        name="ScreenOrdersConfig"
        options={{
          title: 'Configurar Ordenes'
        }}
        component={ScreenOrdersConfig}
      />

      {/* ******************************************** 
                  NESTING STACKS                 
       *******************************************rz */}

      {/* SECTIONS  */}
      <Stack.Screen
        name="StackSections"
        options={{
          title: 'Areas',
          headerShown: false // hide the header on the sections stack
        }}
        component={StackSections}
      />

      {/* STAFF  */}
      <Stack.Screen
        name="StackStaff"
        options={{
          title: 'Staff',
          headerShown: false // hide the header on the sections stack
        }}
        component={StackStaff}
      />

      {/* CASHBOX  */}

      <Stack.Screen
        name="StackBalances"
        options={{
          title: 'Cortes',
          headerShown: false
        }}
        component={StackBalancesE}
      />
      {/* ORDERS  */}
      <Stack.Screen
        name="StackOrders"
        options={{
          title: 'Ordenes',
          headerShown: false
        }}
        component={StackOrders}
      />
      {/* PAYMENTS  */}
      <Stack.Screen
        name="StackPayments"
        options={{
          title: 'Pagos',
          headerShown: false
        }}
        component={StackPaymentsE}
      />

      {/* CLIENTS */}
      <Stack.Screen
        name="StackClients"
        options={{
          title: 'Clientes',
          headerShown: false
        }}
        component={StackClients}
      />

      {/* ******************************************** 
                 MORE SCREENS                 
       *******************************************rz */}

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
      <Stack.Screen
        name="ScreenItemsMap"
        component={ScreenItemsMap}
        options={{
          title: 'Mapa'
        }}
      />
      <Stack.Screen
        name="StackItems"
        options={{
          title: 'Items',
          headerShown: false
          //tabBarButton: () => null
        }}
        component={StackItems}
      />
    </Stack.Navigator>
  )
}
export default StackStore
export const StackStoreE = (props) => (
  <ErrorBoundary componentName="StackStore">
    <StackStore {...props} />
  </ErrorBoundary>
)
