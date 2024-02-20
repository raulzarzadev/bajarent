import { createStackNavigator } from '@react-navigation/stack'
import ScreenCreateStore from './ScreenStoreCreate'
import ScreenStore from './ScreenStore'
import ScreenStoreEdit from './ScreenStoreEdit'
import ScreenStaff from './ScreenStaff'
import ScreenStaffNew from './ScreenStaffNew'
import ScreenStaffDetails from './ScreenStaffDetails'
import ScreenStaffEdit from './ScreenStaffEdit'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import ScreenSections from './ScreenSections'
import ScreenSectionsNew from './ScreenSectionsNew'
import ScreenSectionsDetails from './ScreenSectionsDetails'
import ScreenSectionsEdit from './ScreenSectionsEdit'
import MyStaffLabel from './MyStaffLabel'
import ScreenCashbox from './ScreenCashbox'
import ScreenPayments from './ScreenPayments'
import ScreenPaymentsDetails from './ScreenPaymentsDetails'
import ScreenBalances from './ScreenBalances'
import ScreenBalancesDetails from './ScreenBalancesDetails'
import ScreenBalancesNew from './ScreenBalancesNew'

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
          title: 'Detalles de Staff '
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
        component={ScreenSections}
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

      {/* CASHBOX  */}
      <Stack.Screen
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
      />
      <Stack.Screen
        name="Balances"
        options={{
          title: 'Balances'
        }}
        component={ScreenBalances}
      />
      <Stack.Screen
        name="BalancesDetails"
        options={{
          title: 'Detalle de balance'
        }}
        component={ScreenBalancesDetails}
      />
      <Stack.Screen
        name="BalancesNew"
        options={{
          title: 'Nuevo balance'
        }}
        component={ScreenBalancesNew}
      />
    </Stack.Navigator>
  )
}
export default StackStore
