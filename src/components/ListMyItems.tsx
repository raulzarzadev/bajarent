import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import { RowSectionItemsE } from './ListAssignedItems'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import useMyNav from '../hooks/useMyNav'
import { formatItems } from '../contexts/employeeContext'
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
  items?: MyItem[]
}
const ListMyItems = ({ items }: { items: ItemType[] }) => {
  const formattedItems = items.map((item) => {
    return {
      ...item,
      categoryName: item.categoryName || 'Sin categoría',
      assignedSectionName: item.assignedSectionName || 'Sin asignar'
    }
  })
  const { toItems } = useMyNav()

  const sections = groupSectionItems(items || [])
  console.log({ sections, formattedItems })

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
            <RowSectionItemsE items={items} />
          </View>
        )
      })}
    </View>
  )

  return (
    <View>
      <Text style={[gStyles.helper, gStyles.tCenter]}>Todos los artículos</Text>
      {sections
        .sort((a, b) => {
          return a[0].localeCompare(b[0])
        })
        .map(([key, items]) => {
          if (items.length === 0) return null
          return (
            <View key={key}>
              <Text style={gStyles.h3}>
                {storeSections.find((s) => s.id === key)?.name ||
                  'Sin asignar '}
                {`(${items.length})`}
              </Text>
              <RowSectionItemsE
                items={items.sort((a, b) => a.number.localeCompare(b.number))}
                itemSelected={itemSelected}
                onPressItem={(id) => {
                  if (onPressItem) {
                    onPressItem?.(id)
                  } else {
                    toItems({ id })
                  }
                }}
              />
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
