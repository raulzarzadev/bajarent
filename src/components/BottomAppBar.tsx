import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuth } from '../contexts/authContext'
import StackOrders from './StackOrders'
import StackProfile from './StackProfile'
import StackStore from './StackStore'
import { Icon } from 'react-native-elements'
import StackMyOrders from './StackMyOrders'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { user } = useAuth()
  const { store } = useStore()
  if (!user)
    return (
      <ErrorBoundary componentName="NotUserTabs">
        <NotUserTabs />
      </ErrorBoundary>
    )

  if (!store)
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
            const icons = {
              Store: 'storefront',
              Orders: 'list',
              Profile: 'person',
              Components: 'apps-outline',
              MyOrders: 'fastfood'
            }
            return <Icon name={icons[route.name]} size={size} color={color} />
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
      <Tab.Screen
        name="Store"
        component={StackStore}
        options={{
          title: 'Tienda ',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  )
}

const NotUserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Store: 'storefront',
              Orders: 'list',
              Profile: 'person',
              Components: 'apps-outline',
              MyOrders: 'fastfood'
            }
            return <Icon name={icons[route?.name]} size={size} color={color} />
          }
        }
      }}
    >
      <ErrorBoundary componentName="StackStore">
        <Tab.Screen
          name="Profile"
          component={StackProfile}
          options={{
            title: 'Perfil',
            headerShown: false
          }}
        />
      </ErrorBoundary>
    </Tab.Navigator>
  )
}

const UserAndStoreTabs = () => {
  const { staffPermissions } = useStore()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Store: 'storefront',
              Orders: 'list',
              Profile: 'person',
              Components: 'apps-outline',
              MyOrders: 'fastfood'
            }
            return <Icon name={icons[route.name]} size={size} color={color} />
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
      {(staffPermissions?.canViewOrders || staffPermissions?.isAdmin) && (
        <Tab.Screen
          name="Orders"
          component={StackOrders}
          options={{
            title: 'Ordenes',
            headerShown: false
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
    </Tab.Navigator>
  )
}

export default BottomAppBar
