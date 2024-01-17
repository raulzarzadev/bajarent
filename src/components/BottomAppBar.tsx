import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './HomeScreen'
import OrdersScreen from './OrdersScreen'
import Ionicons from '@expo/vector-icons/Ionicons'
import NewOrderScreen from './NewOrderScreen'

const Tab = createBottomTabNavigator()

const BottomAppBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline'
            } else if (route.name === 'Orders') {
              iconName = focused ? 'list' : 'list-outline'
            } else if (route.name === 'NewOrder') {
              iconName = focused ? 'add-circle' : 'add-circle-outline'
            }
            return <Ionicons name={iconName} size={size} color={color} />
          }
        }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="NewOrder" component={NewOrderScreen} />
    </Tab.Navigator>
  )
}

export default BottomAppBar

const styles = StyleSheet.create({})
