import { View, Text, Pressable } from 'react-native'
import ListRow, { ListRowField } from '../ListRow'
import { CellItemsE, CellOrdersE } from '../BusinessStatus'
import Divider from '../Divider'
import { BalanceRowType } from '../../types/BalanceType'
import { useEffect, useState } from 'react'
import { getItem, setItem } from '../../libs/storage'
import { gStyles } from '../../styles'
import { useStore } from '../../contexts/storeContext'
import { BalanceItems, StoreBalanceType } from '../../types/StoreBalance'
import ErrorBoundary from '../ErrorBoundary'
import {
  ExpandibleBalanceItemsAvailable,
  ExpandibleBalanceItemsRented
} from './SectionBalanceRents'

const BALANCE_ROW_SELECTED = 'balanceRowSelected'

const BalanceItemsTable = ({ balance }: BalanceItemsTableProps) => {
  const { sections: storeSections } = useStore()

  const availableItems = balance.items

  const orderItems = balance.orders
    .filter((order) => order.orderType === 'RENT')
    .map((o) => o.items)
    .flat()
  const allItems = [...availableItems, ...orderItems]

  const groupedBySection = allItems.reduce(
    (acc, item) => {
      if (!acc[item?.assignedSection]) acc[item?.assignedSection] = [item]
      else acc[item?.assignedSection].push(item)
      return acc
    },
    { all: allItems } as { [key: string]: BalanceItems[] }
  )

  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  useEffect(() => {
    getItem(BALANCE_ROW_SELECTED).then((selectedRow) => {
      setSelectedRow(selectedRow)
    })
  }, [])

  const handleSelectRow = (rowId: string) => {
    if (selectedRow === rowId) {
      setSelectedRow(null)
      setItem(BALANCE_ROW_SELECTED, null)
    } else {
      setSelectedRow(rowId)
      setItem(BALANCE_ROW_SELECTED, rowId)
    }
  }

  return (
    <View>
      {/* HEADER */}
      <ListRow
        style={{ borderWidth: 0 }}
        fields={table.map(({ label, width }) => ({
          component: (
            <Text
              key={label}
              numberOfLines={1}
              style={[gStyles.tBold, gStyles.helper, gStyles.tCenter]}
            >
              {label}
            </Text>
          ),
          width
        }))}
      />

      {/* ROWS */}
      {Object.keys(groupedBySection)
        ?.sort((a, b) => {
          const aName =
            storeSections?.find((s) => s.id === a)?.name || 'Sin asignar'
          const bName =
            storeSections?.find((s) => s.id === b)?.name || 'Sin asignar'
          return aName.localeCompare(bName)
        })
        .sort((a, b) => {
          // always put  storage at second row
          if (a === 'workshop') return -1
          if (b === 'workshop') return 1
          return 0
        })
        .sort((a, b) => {
          // always put all at the first row
          if (a === 'all') return -1
          if (b === 'all') return 1
          return 0
        })
        .sort((a, b) => {
          // always put without section at the last row
          if (a === 'withoutSection') return -1
          if (b === 'withoutSection') return 1
          return 0
        })
        .map((balanceRow: string) => {
          const balanceRowItems = groupedBySection[balanceRow]
          const inRent = balanceRowItems.filter((i) => !!i?.orderId)
          const inStock = balanceRowItems.filter((i) => !i?.orderId)
          return (
            <View key={balanceRow}>
              <Divider mv={0} />
              <View
                style={{
                  backgroundColor:
                    selectedRow === balanceRow ? 'lightblue' : 'transparent'
                }}
              >
                <Pressable onPress={() => handleSelectRow(balanceRow)}>
                  <ListRow
                    key={balanceRow}
                    style={{
                      marginVertical: 2,
                      // backgroundColor:
                      //   selectedRow === balanceRow ? 'lightblue' : 'transparent',
                      borderWidth: 0
                    }}
                    fields={table.map(({ field, width }) => {
                      if (field === 'section') {
                        return {
                          component: (
                            <Text
                              numberOfLines={1}
                              style={[
                                gStyles.tBold,
                                gStyles.helper,
                                gStyles.tCenter
                              ]}
                            >
                              {sectionLabel({
                                sectionId: balanceRow,
                                storeSections
                              })}
                            </Text>
                          ),
                          width
                        }
                      }
                      return {
                        component: (
                          <View>
                            <Text style={gStyles.tCenter}>
                              {field === 'inRent' && inRent.length}
                              {field === 'inStock' && inStock.length}
                              {field === 'allItems' && balanceRowItems.length}
                            </Text>
                          </View>
                        ),
                        width
                      }
                    })}
                  />
                </Pressable>
                {selectedRow === balanceRow && (
                  <View>
                    <Text style={[gStyles.tBold, gStyles.h2]}>
                      {sectionLabel({ sectionId: balanceRow, storeSections })}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly'
                      }}
                    >
                      <ExpandibleBalanceItemsRented
                        items={inRent}
                        label="Items en renta"
                        defaultExpanded
                      />
                      <ExpandibleBalanceItemsAvailable
                        items={inStock}
                        label="Items disponibles"
                        defaultExpanded
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          )
        })}
    </View>
  )
}
export type BalanceItemsTableProps = {
  balance: StoreBalanceType
}
export const BalanceItemsTableE = (props: BalanceItemsTableProps) => (
  <ErrorBoundary componentName="BalanceItemsTable">
    <BalanceItemsTable {...props} />
  </ErrorBoundary>
)
export default BalanceItemsTable
const allFieldsAreEmpty = (balanceRow: BalanceRowType) => {
  return Object.keys(balanceRow).every((key) => {
    if (key === 'section') return true
    if (Array.isArray(balanceRow[key])) {
      return !balanceRow[key].length
    }
    return !balanceRow[key]
  })
}
const sectionLabel = ({ sectionId, storeSections }) => {
  if (sectionId === 'all') return 'Todas'
  if (sectionId === 'withoutSection') return 'Sin area'
  if (sectionId === 'workshop') return 'Taller'
  return storeSections.find((s) => s.id === sectionId)?.name || 'S/N'
}

const table: {
  field: keyof BalanceRowType | 'allItems' | 'newRouteItems' | 'newStoreItems'
  label: string
  width: ListRowField['width']
}[] = [
  { field: 'section', label: 'AREA', width: 100 },
  // {
  //   field: 'newRouteItems',
  //   label: 'Nuevos (ruta)',
  //   width: 'rest'
  // },
  // {
  //   field: 'newStoreItems',
  //   label: 'Nuevos',
  //   width: 'rest'
  // },
  {
    field: 'inRent',
    label: 'En renta',
    width: 'rest'
  },
  {
    field: 'inStock',
    label: 'Disponibles',
    width: 'rest'
  },
  {
    field: 'allItems',
    label: 'Todos',
    width: 'rest'
  }
]
