import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
import ItemType from '../types/ItemType'
import theme, { colors } from '../theme'
import { CategoryType } from '../types/RentItem'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import Button from './Button'
import ItemActions from './ItemActions'

export type ListAssignedItemsProps = {
  categoryId?: CategoryType['id']
  onPressItem?: (itemId: string) => void
  itemSelected?: string
}
const ListAssignedItems = (props: ListAssignedItemsProps) => {
  const { storeId } = useStore()
  const categoryId = props?.categoryId
  const onPressItem = props?.onPressItem
  const itemSelected = props?.itemSelected
  const { employee } = useEmployee()
  const employeeSections = employee?.sectionsAssigned || []

  const [availableItems, setAvailableItems] = React.useState([])
  useEffect(() => {
    if (storeId && employeeSections.length) {
      ServiceStoreItems.listenAvailableBySections({
        storeId,
        userSections: employeeSections,
        cb: (items) => {
          setAvailableItems(items)
        }
      })
    }
  }, [storeId, employeeSections])

  return (
    <View>
      {availableItems.length > 0 && (
        <Text style={[gStyles.helper, gStyles.tCenter]}>
          Items disponibles {availableItems.length || 0}
        </Text>
      )}
      <FlatList
        style={{ margin: 'auto' }}
        horizontal
        data={availableItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RowItem
            item={item}
            selected={itemSelected === item.id}
            onPress={() => {
              onPressItem?.(item.id)
            }}
          />
        )}
      />
    </View>
  )
}
const RowItem = ({
  item,
  selected,
  onPress
}: {
  item: Partial<ItemType>
  selected?: boolean
  onPress?: () => void
}) => {
  const { categories } = useStore()
  const categoryName = categories.find(
    (cat) =>
      cat.id === item.category ||
      cat.name === item.categoryName ||
      cat.name === item.category
  )?.name
  const modal = useModal({ title: 'Item actions' })
  return (
    <>
      <StyledModal {...modal}>
        <ItemActions itemId={item.id} itemSection={item.assignedSection} />
      </StyledModal>
      <Pressable
        onPress={onPress}
        onLongPress={() => {
          modal.toggleOpen()
        }}
      >
        <View
          style={{
            width: 120,
            height: 60,
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
      </Pressable>
    </>
  )
}

export default ListAssignedItems

export const ListAssignedItemsE = (props: ListAssignedItemsProps) => (
  <ErrorBoundary componentName="ListAssignedItems">
    <ListAssignedItems {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({})
