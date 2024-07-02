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

const ListItemsSections = () => {
  const { storeId, items, storeSections } = useStore()
  const { toItems } = useMyNav()
  const [getItems, setGetItems] = React.useState<'all' | 'pickedUp'>('pickedUp')
  const [groupedItems, setGroupedItems] = React.useState<
    Record<string, ItemType[]>
  >({})

  useEffect(() => {
    if (getItems === 'all') {
      const groupedItems = groupSectionItems(items)
      setGroupedItems(groupedItems)
    } else {
      ServiceStoreItems.listenAvailableBySections({
        storeId,
        cb: (items) => {
          const groupedItems = groupSectionItems(items)
          setGroupedItems(groupedItems)
        }
      })
    }
  }, [getItems])

  const sections = Object.entries(groupedItems)
  return (
    <View>
      {/* <InputRadios
        layout="row"
        options={[
          { label: 'Todos', value: 'all' },
          { label: 'Disponibles', value: 'pickedUp' }
        ]}
        setValue={setGetItems}
        value={getItems}
      /> */}
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
