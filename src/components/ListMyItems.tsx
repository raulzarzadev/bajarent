import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import { RowSectionItemsE } from './ListAssignedItems'
import dictionary, { asCapitalize } from '../dictionary'
import { ModalFilterListE } from './ModalFilterList'
import theme, { colors } from '../theme'
import { useStore } from '../contexts/storeContext'
import StoreType from '../types/StoreType'

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
  const [filteredData, setFilteredData] = useState<Partial<ItemType>[]>(items)
  const { sections: storeSections } = useStore()
  const sections = groupSectionItems(filteredData || [], storeSections)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const handlePressItem = (itemId: string) => {
    setSelectedItem(itemId)
  }

  return (
    <View
      style={
        (gStyles.container,
        [
          {
            maxWidth: 800,
            marginHorizontal: 'auto',
            paddingTop: 6,
            width: '100%'
          }
        ])
      }
    >
      {/* <Text style={[gStyles.h1, { marginBottom: 16 }]}>Artículos</Text> */}
      <View style={{ marginBottom: 12 }}>
        <ModalFilterListE
          data={items}
          setData={(data) => {
            setFilteredData(data)
          }}
          filters={[
            {
              field: 'categoryName',
              label: 'Categoría',
              icon: 'washMachine',
              color: theme.primary
            },
            {
              label: 'Dañado',
              field: 'needFix',
              boolean: true,
              booleanValue: true,
              color: theme.error,
              icon: 'wrench'
            },
            {
              label: 'Disponible',
              field: 'needFix',
              boolean: true,
              booleanValue: false,
              color: theme.success,
              icon: 'done'
            }
          ]}
        />
      </View>
      {Object.entries(sections)
        .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
        .map(([key, items]) => {
          return (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={gStyles.h2}>
                {asCapitalize(dictionary(key))} {`(${items?.length || 0})`}
              </Text>
              <RowSectionItemsE
                items={items}
                layout="flex"
                onPressItem={handlePressItem}
                itemSelected={selectedItem}
              />
            </View>
          )
        })}
    </View>
  )
}
const groupSectionItems = (
  items: any,
  storeSections: StoreType['sections']
) => {
  const groupedItems: Record<string, ItemType[]> = {
    //unassigned: []
  }
  items.forEach((item: any) => {
    const assignedSection = item?.assignedSection || 'unassigned'
    const sectionName =
      storeSections?.find((section) => section.id === assignedSection)?.name ||
      'unassigned'
    if (!groupedItems[sectionName]) {
      groupedItems[sectionName] = []
    }
    groupedItems[sectionName].push(item)
  })
  return groupedItems
}

export const ListMyItemsE = (props: ListMyItemsProps) => (
  <ErrorBoundary componentName="ListMyItems">
    <ListMyItems {...props} />
  </ErrorBoundary>
)

export default ListMyItems
