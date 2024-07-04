import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useStore } from '../contexts/storeContext'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import { RowSectionItemsE } from './ListAssignedItems'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import InputRadios from './InputRadios'
import useMyNav from '../hooks/useMyNav'
import { formatItems, useEmployee } from '../contexts/employeeContext'

const ListItemsSections = () => {
  const { storeId, storeSections, categories } = useStore()
  const { items } = useEmployee()
  const { toItems } = useMyNav()
  const [getItems, setGetItems] = React.useState<'all' | 'pickedUp'>('pickedUp')
  const [groupedItems, setGroupedItems] = React.useState<
    Record<string, ItemType[]>
  >({})

  //const formattedItems = formatItems(items, categories, storeSections)

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
      {sections.map(([key, items]) => {
        if (items.length === 0) return null
        return (
          <View key={key}>
            <Text style={gStyles.h3}>
              {storeSections.find((s) => s.id === key)?.name || 'Sin asignar '}
              {`(${items.length})`}
            </Text>
            <RowSectionItemsE
              items={items}
              onPressItem={(id) => {
                toItems({ id })
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

export const ListItemsSectionsE = (props) => (
  <ErrorBoundary componentName="ListItemsSections">
    <ListItemsSections {...props} />
  </ErrorBoundary>
)

export default ListItemsSections
