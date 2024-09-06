import { View, Text } from 'react-native'
import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import { RowSectionItemsE } from './ListAssignedItems'
import useMyNav from '../hooks/useMyNav'
import dictionary, { asCapitalize } from '../dictionary'

export type MyItem = Pick<
  ItemType,
  | 'brand'
  | 'number'
  | 'needFix'
  | 'assignedSection'
  | 'assignedSectionName'
  | 'id'
  | 'category'
  | 'categoryName'
  | 'status'
  | 'serial'
  | 'isRented'
  | 'isPickedUp'
  | 'lastInventoryAt'
> & {}

export type ListMyItemsProps = {
  items: Partial<ItemType>[]
}

const ListMyItems = ({ items }: ListMyItemsProps) => {
  const sections = groupSectionItems(items || [])

  return (
    <View
      style={(gStyles.container, [{ maxWidth: 800, marginHorizontal: 'auto' }])}
    >
      <Text style={[gStyles.h1, { marginBottom: 16 }]}>Artículos</Text>
      {Object.entries(sections).map(([key, items]) => {
        return (
          <View key={key}>
            <Text style={gStyles.h2}>
              {asCapitalize(dictionary(key))} {`(${items?.length || 0})`}
            </Text>
            <RowSectionItemsE items={items} layout="flex" />
          </View>
        )
      })}
    </View>
  )
}
const groupSectionItems = (items: any) => {
  const groupedItems: Record<string, ItemType[]> = {
    //unassigned: []
  }
  items.forEach((item: any) => {
    const assignedSection = item.assignedSectionName || 'unassigned'
    if (!groupedItems[assignedSection]) {
      groupedItems[assignedSection] = []
    }
    groupedItems[assignedSection].push(item)
  })
  return groupedItems
}

export const ListMyItemsE = (props: ListMyItemsProps) => (
  <ErrorBoundary componentName="ListMyItems">
    <ListMyItems {...props} />
  </ErrorBoundary>
)

export default ListMyItems
