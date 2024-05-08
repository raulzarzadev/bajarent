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
import { StackPaymentsE } from './StackPayments'
import StackOrders from './StackOrders'

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
      <Stack.Screen
        name="StackPayments"
        options={{
          title: 'Pagos',
          headerShown: false
        }}
        component={StackPaymentsE}
      />
      <Stack.Screen
        name="StackOrders"
        options={{
          title: 'Ordenes',
          headerShown: false
        }}
        component={StackOrders}
      />

      {/* ******************************************** 
                 MORE SCREENS                 
       *******************************************rz */}

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

      {/* CASHBOX  */}
      {/* <Stack.Screen
        name="Cashbox"
        options={{
          title: 'Caja'
        }}
        component={ScreenCashbox}
      />
      <Stack.Screen
        name="Payments"
        options={{
          title: 'Pagos'
        }}
        component={ScreenPayments}
      />
      <Stack.Screen
        name="PaymentsDetails"
        options={{
          title: 'Detalle de pago'
        }}
        component={ScreenPaymentsDetails}
      /> */}
      {/* <Stack.Screen
        name="Balances"
        options={{
          title: 'Cortes de caja'
        }}
        component={ScreenBalances}
      />
      <Stack.Screen
        name="BalancesDetails"
        options={{
          title: 'Detalle de corte'
        }}
        component={ScreenBalancesDetails}
      />
      <Stack.Screen
        name="BalancesNew"
        options={{
          title: 'Nuevo corte'
        }}
        component={ScreenBalancesNew}
      /> */}

      {/* 
      <Stack.Screen
        options={({ route }) => ({
          //@ts-ignore
          title: route?.params?.title || 'Pagos'
        })}
        name="PaymentsList"
        component={ScreenPayments}
      />

      <Stack.Screen
        options={({ route }) => ({
          //@ts-ignore
          title: route?.params?.title || 'Ordenes'
        })}
        name="OrdersList"
        component={ScreenOrders}
      />

      <Stack.Screen
        name="OrderDetails"
        options={{
          title: 'Detalle de  orden'
        }}
        component={ScreenOrderDetail}
      />
      <Stack.Screen
        name="RenewOrder"
        options={{
          title: 'Renovar Orden'
        }}
        component={ScreenOrderRenew}
      />
      <Stack.Screen
        name="ReorderOrder"
        options={{
          title: 'Re ordenar '
        }}
        component={ScreenOrderReorder}
      /> */}
    </Stack.Navigator>
  )
}
export default StackStore
