import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuth } from '../contexts/authContext'
import StackOrders from './StackOrders'
import StackProfile from './StackProfile'
import StackStore from './StackStore'
// import { Icon } from 'react-native-elements'
import StackMyOrders from './StackMyOrders'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import ScreenComponents from './ScreenComponents'
import ScreenNewOrder from './ScreenOrderNew'
import Icon, { IconName } from './Icon'
import MyStaffLabel from './MyStaffLabel'
import { useEmployee } from '../contexts/employeeContext'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { user } = useAuth()
  const { store, staff, userStores } = useStore()
  const anyStoreOption = !!store || !!staff?.length || !!userStores?.length
  if (!user)
    return (
      <ErrorBoundary componentName="NotUserTabs">
        <NotUserTabs />
      </ErrorBoundary>
    )

  if (!anyStoreOption)
    return (
      <ErrorBoundary componentName="NotStoreTabs">
        <NotStoreTabs />
      </ErrorBoundary>
    )
  return (
    <ErrorBoundary componentName="UserAndStoreTabs">
      <UserAndStoreTabs />
    </ErrorBoundary>
  )
}

const NotStoreTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icons: Record<string, IconName> = {
              Store: 'store',
              Orders: 'orders',
              Profile: 'profile',
              Components: 'components',
              MyOrders: 'myOrders'
            }
            return (
              <Icon
                icon={icons[route.name]}
                // size={size}
                // color={color}
              />
            )
          }
        }
      }}
    >
      <Tab.Screen
        name="Profile"
        component={StackProfile}
        options={{
          title: 'Perfil',
          headerShown: false
        }}
      />
      {/* <Tab.Screen
        name="Store"
        component={StackStore}
        options={{
          title: 'Tienda ',
          headerShown: false
        }}
      /> */}
    </Tab.Navigator>
  )
}

const NotUserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icons: Record<string, IconName> = {
              Store: 'store',
              Orders: 'orders',
              Profile: 'profile',
              Components: 'components',
              MyOrders: 'myOrders'
            }
            return (
              <Icon
                icon={icons[route.name]}
                // size={size}
                // color={color}
              />
            )
          }
        }
      }}
    >
      <Tab.Screen
        name="Profile"
        component={StackProfile}
        options={{
          title: 'Perfil',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  )
}

const UserAndStoreTabs = () => {
  const {
    permissions: { isAdmin, isOwner, orders }
  } = useEmployee()

  const canSeeOrders = orders.canViewAll || isAdmin || isOwner
  const canCreateOrder = orders.canCreate || isAdmin || isOwner
  const canSeeMyOrders = orders?.canViewMy

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
      {canSeeOrders && (
        <Tab.Screen
          name="Orders"
          component={StackOrders}
          options={{
            title: 'Ordenes',
            headerShown: false
          }}
        />
      )}

      {canCreateOrder && (
        <Tab.Screen
          name="NewOrder"
          component={ScreenNewOrder}
          options={{
            title: 'Nueva orden',
            headerRight(props) {
              return <MyStaffLabel />
            }
          }}
        />
      )}

      {canSeeMyOrders && (
        <Tab.Screen
          name="MyOrders"
          component={StackMyOrders}
          options={{
            title: 'Mis ordenes',
            headerShown: false
          }}
        />
      )}

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

      {!!__DEV__ && (
        <Tab.Screen
          name="Components"
          component={ScreenComponents}
          options={{
            title: 'Componentes'
          }}
        />
      )}
    </Tab.Navigator>
  )
}

export default BottomAppBar
