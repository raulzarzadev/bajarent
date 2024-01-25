import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import ScreenProfile from './ScreenProfile'
import ScreenCreateStore from './ScreenCreateStore'
import ScreenStore from './ScreenStore'
import OrdersStackScreen from './ScreenOrderStack'
import { useAuth } from '../contexts/authContext'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { user } = useAuth()

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => {
          return {
            tabBarIcon: ({ focused, color, size }) => {
              let iconName:
                | 'home'
                | 'list'
                | 'add'
                | 'home-outline'
                | 'list-outline'
                | 'add-circle-outline'
                | 'add-circle'
                | 'search'
                | 'search-outline'
                | 'person'
                | 'person-outline' = 'home'

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline'
              } else if (route.name === 'Orders') {
                iconName = focused ? 'list' : 'list-outline'
              } else if (route.name === 'NewOrder') {
                iconName = focused ? 'add-circle' : 'add-circle-outline'
              } else if (route.name === 'Rentar') {
                iconName = focused ? 'search' : 'search-outline'
              } else if (route.name === 'Perfil') {
                iconName = focused ? 'person' : 'person-outline'
              }
              return <Ionicons name={iconName} size={size} color={color} />
            }
          }
        }}
      >
        <Tab.Screen
          name="Store"
          component={ScreenStore}
          options={{
            title: 'Tienda '
          }}
        />

        <Tab.Screen
          name="Orders"
          component={OrdersStackScreen}
          options={{
            title: 'Ordenes',
            headerShown: false
          }}
        />

        {/* TODO: apply validation to hidde when no store is selected in localstorage */}

        <Tab.Screen
          name="Perfil"
          component={ScreenProfile}
          options={{
            title: user ? 'Perfil' : 'Iniciar sesión'
          }}
        />

        <Tab.Screen
          name="Crear tienda"
          component={ScreenCreateStore}
          options={{
            tabBarButton: () => null
          }}
        />
      </Tab.Navigator>
    </>
  )
}

export default BottomAppBar

const styles = StyleSheet.create({})
