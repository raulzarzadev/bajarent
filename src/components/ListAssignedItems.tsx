import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatItems, useEmployee } from '../contexts/employeeContext'
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
import Button from './Button'

export type ListAssignedItemsProps = {
  categoryId?: CategoryType['id']
  onPressItem?: (itemId: string) => void
  itemSelected?: string
  onSelectItem?: (itemId: string) => void
}
const ListAssignedItems = (props: ListAssignedItemsProps) => {
  const onPressItem = props?.onPressItem
  const onSelectItem = props?.onSelectItem
  const itemSelected = props?.itemSelected
  const { items: availableItems } = useEmployee()
  const { categories, storeSections } = useStore()
  const formattedItems = formatItems(availableItems, categories, storeSections)
  return (
    <View>
      {formattedItems.length > 0 && (
        <Text style={[gStyles.helper, gStyles.tCenter]}>
          Mis artículos disponibles {availableItems.length || 0}
        </Text>
      )}
      <RowSectionItems
        items={formattedItems}
        itemSelected={itemSelected}
        onPressItem={onPressItem}
        onSelectItem={onSelectItem}
      />
    </View>
  )
}

export type RowSectionItemsProps = {
  items: Partial<ItemType>[]
  itemSelected?: string
  onPressItem?: (itemId: string) => void
  onSelectItem?: (itemId: string) => void
}
const RowSectionItems = ({
  items,
  itemSelected,
  onPressItem,
  onSelectItem
}: RowSectionItemsProps) => {
  return (
    <FlatList
      style={{ margin: 'auto', maxWidth: '100%', paddingBottom: 12 }}
      horizontal
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <SectionItem
            item={item}
            selected={itemSelected === item.id}
            onPress={() => {
              onPressItem?.(item.id)
            }}
          />
          <View style={{ padding: 2, marginTop: 2 }}>
            {!!onSelectItem && (
              <Button
                variant={itemSelected === item.id ? 'filled' : 'ghost'}
                size="xs"
                fullWidth
                onPress={() => {
                  onSelectItem(item.id)
                }}
                label="Seleccionar"
              ></Button>
            )}
          </View>
        </View>
      )}
    />
  )
}

export const SectionItem = ({
  item,
  selected,
  onPress
}: {
  item: Partial<ItemType>
  selected?: boolean
  onPress?: () => void
}) => {
  const modal = useModal({ title: `Acciones de artículo` })
  return (
    <>
      <StyledModal {...modal}>
        <View style={{ marginBottom: 8 }}>
          <CardItem item={item} />
        </View>
        <ItemActions
          // FIXME: avoid select options
          actions={['select', 'assign', 'fix', 'details']}
          item={item}
          onAction={(type) => {
            if (type === 'select') {
              onPress()
            }
            modal.toggleOpen()
          }}
        />
      </StyledModal>

      <Pressable
        onPress={() => {
          modal.toggleOpen()
        }}
      >
        <View
          style={{
            width: 120,
            minHeight: 80,
            height: '100%',
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
export const RowSectionItemsE = (props: RowSectionItemsProps) => (
  <ErrorBoundary componentName="RowSectionItems">
    <RowSectionItems {...props} />
  </ErrorBoundary>
)
const styles = StyleSheet.create({})
