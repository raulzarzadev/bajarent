import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
import ItemType from '../types/ItemType'
import { colors } from '../theme'

const ListAssignedItems = () => {
  const { employee } = useEmployee()
  const { store } = useStore()
  const items = Object.values(store?.items || {})
  const employeeSections = employee?.sectionsAssigned || []
  const sectionItems = items.filter((item) =>
    employeeSections.includes(item.assignedSection)
  )
  console.log({ sectionItems })
  const availableItems = sectionItems.filter(
    (item) => item.status === 'available' || item.status === 'pickedUp'
  )
  return (
    <View>
      {availableItems.length > 0 && (
        <Text style={gStyles.h3}>
          Items disponibles: {availableItems.length || 0}
        </Text>
      )}
      <FlatList
        horizontal
        data={availableItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RowItem item={item} />}
      />
    </View>
  )
}
const RowItem = ({ item }: { item: Partial<ItemType> }) => {
  const { categories } = useStore()
  const categoryName = categories.find(
    (cat) =>
      cat.id === item.category ||
      cat.name === item.categoryName ||
      cat.name === item.category
  )?.name
  return (
    <View
      style={{
        width: 120,
        height: 80,
        backgroundColor: colors.lightBlue,
        borderRadius: gSpace(2),
        margin: 2,
        padding: 4,
        justifyContent: 'space-between'
      }}
    >
      <Text numberOfLines={2} style={[gStyles.h3]}>
        {categoryName}
      </Text>
      <Text style={[gStyles.tCenter]}>{item.number}</Text>
      <Text style={[gStyles.helper, gStyles.tCenter]}>{item.serial}</Text>
    </View>
  )
}

export default ListAssignedItems

export const ListAssignedItemsE = (props) => (
  <ErrorBoundary componentName="ListAssignedItems">
    <ListAssignedItems {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({})
