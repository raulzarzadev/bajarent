import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import StackOrders from './StackOrders'
import StackProfile from './StackProfile'
import { StackStoreE } from './StackStore'
import ErrorBoundary from './ErrorBoundary'
import ScreenComponents from './ScreenComponents'
import Icon, { IconName } from './Icon'
import MyStaffLabel from './MyStaffLabel'
import { useEmployee } from '../contexts/employeeContext'
import StackItems from './StackItems'
import StackMyItems from './StackMyItems'
import { StackWorkshopE } from './StackWorkshop'
import { useStore } from '../contexts/storeContext'
import { StackCustomersE } from './Customers/StackCustomers'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { store } = useStore()
  const { permissions, employee } = useEmployee()
  const viewWorkshop =
    employee?.roles?.technician ||
    employee?.rol === 'technician' ||
    permissions?.isAdmin ||
    permissions?.isOwner

  const showProfileButton = true
  const showOrdersButton = !!store
  const showStoreButton = !!store
  const viewItemsTab =
    permissions.items.canViewAllItems ||
    permissions.items.canViewMyItems ||
    permissions.isAdmin ||
    permissions.isOwner
  const showCustomerButton = permissions?.customers?.read
  return (
    <Tab.Navigator
      //initialRouteName="StackOrders"
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icons: Record<string, IconName> = {
              Store: 'store',
              Orders: 'orders',
              Profile: 'profile',
              NewOrder: 'add',
              Components: 'components',
              MyOrders: 'myOrders',
              StackOrders: 'orders',
              StackConsolidated: 'orders',
              StackMyItems: 'washMachine',
              Workshop: 'tools',
              StackCustomers: 'customerCard'
            }
            return (
              <Icon
                icon={icons[route.name]}
                // size={size}
                color={color}
              />
            )
          },

          tabBarIconStyle: {
            marginTop: 0 //* <- Avoid the scroll small scroll in all  app
          },
          //* shows the staff label on the right side of the header specially for __DEV__ components
          headerRight(props) {
            return <MyStaffLabel />
          }
        }
      }}
    >
      <Tab.Screen
        name="Store"
        component={StackStoreE}
        options={{
          title: 'Tienda ',
          headerShown: false,
          //* hide the tab bar button on the store screen
          tabBarButton: showStoreButton ? undefined : () => null
        }}
      />

      <Tab.Screen
        name="StackMyItems"
        options={{
          title: 'Artículos',
          headerShown: false,
          tabBarButton: viewItemsTab ? undefined : () => null
        }}
        component={StackMyItems}
      />
      <Tab.Screen
        name="Workshop"
        options={{
          headerShown: false,
          title: 'Taller',
          tabBarButton: viewWorkshop ? undefined : () => null
        }}
        component={StackWorkshopE}
      />

      <Tab.Screen
        name="StackOrders"
        component={StackOrders}
        options={({ route }) => ({
          headerShown: false,
          title: 'Ordenes',
          tabBarButton: showOrdersButton ? undefined : () => null
          // tabBarButton:
          //   !canSeeOrders || !isAuthenticated ? () => null : undefined
        })}
      />
      <Tab.Screen
        name="StackCustomers"
        component={StackCustomersE}
        options={({ route }) => ({
          headerShown: false,
          title: 'Clientes',
          tabBarButton: showCustomerButton ? undefined : () => null
        })}
      />

      <Tab.Screen
        name="Profile"
        component={StackProfile}
        options={{
          title: employee?.name?.split(' ')?.[0]?.substring(0, 12) || 'Perfil',
          headerShown: false,
          //* hide the tab bar button on the profile screen
          tabBarButton: showProfileButton ? undefined : () => null
        }}
      />
      <Tab.Screen
        name="Components"
        component={ScreenComponents}
        options={{
          title: 'Componentes',
          tabBarButton: !__DEV__ ? () => null : undefined
        }}
      />
      <Tab.Screen
        name="StackItems"
        options={{
          title: 'Items',
          headerShown: false,
          tabBarButton: () => null
        }}
        component={StackItems}
      />
    </Tab.Navigator>
  )
}

export const BottomAppBarE = () => {
  return (
    <ErrorBoundary componentName="NotUserTabs">
      <BottomAppBar />
    </ErrorBoundary>
  )
}

export default BottomAppBar
