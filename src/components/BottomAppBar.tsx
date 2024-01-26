import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import ScreenStore from './ScreenStore'
import OrdersStackScreen from './ScreenOrderStack'
import { useAuth } from '../contexts/authContext'
import ScreenComponents from './ScreenComponents'
import ScreenProfileStack from './ScreenProfileStack'
const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  const { user } = useAuth()

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => {
          return {
            tabBarIcon: ({ focused, color, size }) => {
              const icons = {
                Store: 'home',
                Orders: 'list',
                Profile: 'person',
                Components: 'apps-outline'
              }
              return (
                <Ionicons name={icons[route.name]} size={size} color={color} />
              )
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
          name="Profile"
          component={ScreenProfileStack}
          options={{
            title: user ? 'Perfil' : 'Iniciar sesión',
            headerShown: false
          }}
        />

        {/* <Tab.Screen
          name="Crear tienda"
          component={ScreenCreateStore}
          options={{
            tabBarButton: () => null
          }}
        /> */}
        <Tab.Screen
          name="Components"
          component={ScreenComponents}
          // options={{
          //   tabBarButton: () => null
          // }}
        />
      </Tab.Navigator>
    </>
  )
}

export default BottomAppBar

const styles = StyleSheet.create({})
