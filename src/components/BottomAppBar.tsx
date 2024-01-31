import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuth } from '../contexts/authContext'
import StackOrders from './StackOrders'
import StackProfile from './StackProfile'
import StackStore from './StackStore'
import { Icon } from 'react-native-elements'
import StackMyOrders from './StackMyOrders'
import { useStore } from '../contexts/storeContext'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { user } = useAuth()
  const { store } = useStore()
  if (!user) return <NotUserTabs />
  if (!store) return <NotStoreTabs />
  return <UserAndStoreTabs />
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
    </Tab.Navigator>
  )
}

const UserAndStoreTabs = () => {
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

      <Tab.Screen
        name="Orders"
        component={StackOrders}
        options={{
          title: 'Ordenes',
          headerShown: false
        }}
      />

      <Tab.Screen
        name="MyOrders"
        component={StackMyOrders}
        options={{
          title: 'Mis ordenes',
          headerShown: false
        }}
        // options={{
        //   tabBarButton: () => null
        // }}
      />

      {/* TODO: apply validation to hidde when no store is selected in localstorage */}

      {/* <Tab.Screen
        name="Profile"
        component={StackProfile}
        options={{
          title: 'Perfil',
          headerShown: false
        }}
      /> */}

      {/* <Tab.Screen
          name="Crear tienda"
          component={ScreenCreateStore}
          options={{
            tabBarButton: () => null
          }}
        /> */}
      {/* <Tab.Screen
        name="Components"
        component={ScreenComponents}
        options={{
          // tabBarButton: () => null
        }}
      /> */}
    </Tab.Navigator>
  )
}

export default BottomAppBar

const styles = StyleSheet.create({})
