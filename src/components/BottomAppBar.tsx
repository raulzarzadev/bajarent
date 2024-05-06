import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import StackOrders from './StackOrders'
import StackProfile from './StackProfile'
import StackStore from './StackStore'
import ErrorBoundary from './ErrorBoundary'
import ScreenComponents from './ScreenComponents'
import ScreenNewOrder from './ScreenOrderNew'
import Icon, { IconName } from './Icon'
import MyStaffLabel from './MyStaffLabel'
import { useEmployee } from '../contexts/employeeContext'
import { useAuth } from '../contexts/authContext'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { isAuthenticated } = useAuth()
  const {
    permissions: { isAdmin, isOwner, orders }
  } = useEmployee()

  const canSeeOrders = orders.canViewAll || isAdmin || isOwner
  const canCreateOrder = orders.canCreate || isAdmin || isOwner
  const canSeeMyOrders = !!orders?.canViewMy
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icons: Record<string, IconName> = {
              Store: 'store',
              Orders: 'orders',
              Profile: 'profile',
              NewOrder: 'add',
              Components: 'components',
              MyOrders: 'myOrders'
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
        component={StackStore}
        options={{
          title: 'Tienda ',
          headerShown: false,
          //* hide the tab bar button on the store screen
          tabBarButton: () => null
        }}
      />

      <Tab.Screen
        name="Orders"
        component={StackOrders}
        options={{
          title: 'Ordenes',
          //headerShown: false,
          tabBarButton:
            !canSeeOrders || !isAuthenticated ? () => null : undefined
        }}
      />

      <Tab.Screen
        name="NewOrder"
        component={ScreenNewOrder}
        options={{
          title: 'Nueva orden',
          headerRight(props) {
            return <MyStaffLabel />
          },
          tabBarButton:
            !canCreateOrder || !isAuthenticated ? () => null : undefined
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={StackOrders}
        options={{
          title: 'Mis ordenes',
          //headerShown: true,
          tabBarButton:
            !canSeeMyOrders || !isAuthenticated ? () => null : undefined
        }}
      />
      <Tab.Screen
        name="Profile"
        component={StackProfile}
        options={{
          title: 'Perfil',
          headerShown: false,
          //* hide the tab bar button on the profile screen
          tabBarButton: () => null
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
