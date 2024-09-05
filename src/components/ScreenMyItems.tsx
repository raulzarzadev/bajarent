import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ListItemsSectionsE } from './ListItemsSections'
import { useEmployee } from '../contexts/employeeContext'
import { ListMyItemsE } from './ListMyItems'

const ScreenMyItems = () => {
  const { employee, items } = useEmployee()
  return (
    <View>
      <ListMyItemsE items={items} />
    </View>
  )
}

export default ScreenMyItems

const styles = StyleSheet.create({})
