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
  const { staffPermissions, store } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user?.id
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
          }
        }
      }}
    >
      <Tab.Screen
        name="Store"
        component={StackStore}
        options={{
          title: 'Tienda ',
          headerShown: false
        }}
      />
      {(staffPermissions?.canViewOrders ||
        staffPermissions?.isAdmin ||
        isOwner) && (
        <Tab.Screen
          name="Orders"
          component={StackOrders}
          options={{
            title: 'Ordenes',
            headerShown: false
          }}
        />
      )}

      {(staffPermissions?.canCreateOrder ||
        staffPermissions?.isAdmin ||
        isOwner) && (
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

      {(staffPermissions?.canViewMyOrders || staffPermissions?.isAdmin) && (
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
          headerShown: false
        }}
      />

      {!!__DEV__ && (
        <Tab.Screen
          name="Components"
          component={ScreenComponents}
          options={{
            title: 'Componentes',
            headerShown: false
          }}
        />
      )}
    </Tab.Navigator>
  )
}

export default BottomAppBar
