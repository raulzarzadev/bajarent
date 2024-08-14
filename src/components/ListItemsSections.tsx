import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import { RowSectionItemsE } from './ListAssignedItems'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import useMyNav from '../hooks/useMyNav'
import { formatItems, useEmployee } from '../contexts/employeeContext'
export type ListItemsSectionsProps = {
  onPressItem?: (itemId: string) => void
  itemSelected?: string
}
const ListItemsSections = ({
  itemSelected,
  onPressItem
}: ListItemsSectionsProps) => {
  const { storeId, storeSections, categories } = useStore()
  const { toItems } = useMyNav()
  const [groupedItems, setGroupedItems] = React.useState<
    Record<string, ItemType[]>
  >({})

  useEffect(() => {
    ServiceStoreItems.listenAvailableBySections({
      storeId,
      userSections: 'all',
      cb: (items) => {
        const formattedItems = formatItems(items, categories, storeSections)
        const groupedItems = groupSectionItems(formattedItems)
        setGroupedItems(groupedItems)
      }
    })
  }, [])

  const sections = Object.entries(groupedItems)
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
    unassigned: []
  }
  items.forEach((item: any) => {
    const assignedSection = item.assignedSection || 'unassigned'
    if (!groupedItems[assignedSection]) {
      groupedItems[assignedSection] = []
    }
    groupedItems[assignedSection].push(item)
  })
  return groupedItems
}

export const ListItemsSectionsE = (props: ListItemsSectionsProps) => (
  <ErrorBoundary componentName="ListItemsSections">
    <ListItemsSections {...props} />
  </ErrorBoundary>
)

export default ListItemsSections
