import { View, Text } from 'react-native'
import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import { RowSectionItemsE } from './ListAssignedItems'
import dictionary, { asCapitalize } from '../dictionary'
import { ModalFilterListE } from './ModalFilterList'
import theme, { colors } from '../theme'

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
      <View>
        <ModalFilterListE
          data={items}
          setData={(data) => {
            console.log({ data })
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
