import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
import ItemType from '../types/ItemType'
import theme, { colors } from '../theme'
import { CategoryType } from '../types/RentItem'

export type ListAssignedItemsProps = {
  categoryId: CategoryType['id']
  onPressItem?: (itemId: string) => void
  itemSelected?: string
}
const ListAssignedItems = (props: ListAssignedItemsProps) => {
  const categoryId = props.categoryId
  const onPressItem = props.onPressItem
  const itemSelected = props.itemSelected
  const { employee } = useEmployee()
  const { store } = useStore()
  const items = Object.values(store?.items || {})
  const employeeSections = employee?.sectionsAssigned || []
  const sectionItems = items.filter((item) =>
    employeeSections.includes(item.assignedSection)
  )
  // const availableItems = sectionItems.filter(
  //   (item) => item.status === 'available' || item.status === 'pickedUp'
  // )
  const [availableItems, setAvailableItems] = React.useState(sectionItems)
  useEffect(() => {
    const availableItems = sectionItems.filter(
      (item) => item.status === 'available' || item.status === 'pickedUp'
    )
    if (categoryId) {
      const categoryItems = availableItems.filter(
        (item) => item.category === categoryId
      )
      setAvailableItems(categoryItems)
    } else {
      setAvailableItems(availableItems)
    }
  }, [categoryId])
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
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              onPressItem?.(item.id)
            }}
          >
            <RowItem item={item} selected={itemSelected === item.id} />
          </Pressable>
        )}
      />
    </View>
  )
}
const RowItem = ({
  item,
  selected
}: {
  item: Partial<ItemType>
  selected?: boolean
}) => {
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
        backgroundColor: selected ? colors.lightBlue : theme.base,
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

export const ListAssignedItemsE = (props: ListAssignedItemsProps) => (
  <ErrorBoundary componentName="ListAssignedItems">
    <ListAssignedItems {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({})
