import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import { gSpace, gStyles } from '../styles'
import ItemType from '../types/ItemType'
import theme, { colors } from '../theme'
import { CategoryType } from '../types/RentItem'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import ItemActions from './ItemActions'
import CardItem from './CardItem'

export type ListAssignedItemsProps = {
  categoryId?: CategoryType['id']
  onPressItem?: (itemId: string) => void
  itemSelected?: string
}
const ListAssignedItems = (props: ListAssignedItemsProps) => {
  const onPressItem = props?.onPressItem
  const itemSelected = props?.itemSelected
  const { items: availableItems } = useEmployee()
  console.log({ availableItems })
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
  const modal = useModal({ title: `Acciones de artículos` })
  return (
    <>
      <StyledModal {...modal}>
        <View style={{ marginBottom: 8 }}>
          <CardItem item={item} />
        </View>
        <ItemActions item={item} />
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
            height: 80,
            backgroundColor: selected ? colors.lightBlue : theme.base,
            borderRadius: gSpace(2),
            margin: 2,
            padding: 4
          }}
        >
          <CardItem item={item} />
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
