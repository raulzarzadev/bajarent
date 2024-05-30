import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import StackOrders from './StackOrders'
import StackProfile from './StackProfile'
import StackStore from './StackStore'
import ErrorBoundary from './ErrorBoundary'
import ScreenComponents from './ScreenComponents'
import Icon, { IconName } from './Icon'
import MyStaffLabel from './MyStaffLabel'
import { useAuth } from '../contexts/authContext'
import ScreenNewOrder from './ScreenOrderNew'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { store } = useAuth()

  const showProfileButton = true
  const showOrdersButton = !!store
  const showStoreButton = !!store
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
              MyOrders: 'myOrders',
              StackOrders: 'orders'
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
          tabBarButton: showStoreButton ? undefined : () => null
        }}
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
        name="NewOrder"
        component={ScreenNewOrder}
        options={{
          title: 'Nueva Orden'
        }}
      />

      <Tab.Screen
        name="Profile"
        component={StackProfile}
        options={{
          title: 'Perfil',
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
