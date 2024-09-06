import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { ListMyItemsE } from './ListMyItems'

const ScreenMyItems = () => {
  const { items } = useEmployee()
  return (
    <ScrollView>
      <ListMyItemsE items={items} />
    </ScrollView>
  )
}

export default ScreenMyItems

const styles = StyleSheet.create({})
