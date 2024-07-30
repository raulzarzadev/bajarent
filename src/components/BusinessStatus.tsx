import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import ListRow, { ListRowField } from './ListRow'
import {
  BalanceRowKeyType,
  BalanceRowType,
  BalanceType2
} from '../types/BalanceType'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import { BalanceAmountsE } from './BalanceAmounts'
import ErrorBoundary from './ErrorBoundary'
import SpanOrder from './SpanOrder'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import ItemType from '../types/ItemType'
import { useNavigation } from '@react-navigation/native'
import { formatItems, useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import { Timestamp } from 'firebase/firestore'
import asDate from '../libs/utils-date'

export type BusinessStatusProps = { balance: Partial<BalanceType2> }
const BusinessStatus = ({ balance }: BusinessStatusProps) => {
  const { storeSections, storeId } = useStore()
  const table: {
    field: keyof BalanceRowType
    label: string
    width: ListRowField['width']
  }[] = [
    { field: 'section', label: 'AREA', width: 100 },

    {
      field: 'deliveredToday',
      label: 'ENTREGADAS',
      width: 'rest'
    },

    {
      field: 'renewedToday',
      label: 'RENOVADAS',
      width: 'rest'
    },
    {
      field: 'paidToday',
      label: 'PAGADAS',
      width: 'rest'
    },
    {
      field: 'pickedUpToday',
      label: 'RECOGIDAS',
      width: 'rest'
    },
    {
      field: 'reported',
      label: 'REPORTE',
      width: 'rest'
    },
    {
      field: 'cancelledToday',
      label: 'CANCELADAS',
      width: 'rest'
    },
    {
      field: 'inRent',
      label: 'EN RENTA',
      width: 'rest'
    },
    {
      field: 'inStock',
      label: 'EN CARRO',
      width: 'rest'
    }
  ]

  const [selectedRow, setSelectedRow] = React.useState<string | null>(null)
  const handleSelectRow = (rowId: string) => {
    if (selectedRow === rowId) {
      setSelectedRow(null)
    } else {
      setSelectedRow(rowId)
    }
  }

  return (
    <View style={{ padding: 6, maxWidth: 999, margin: 'auto', width: '100%' }}>
      {/* HEADER */}
      <ListRow
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
      {balance?.sections
        ?.sort((a, b) => {
          const aName =
            storeSections.find((s) => s.id === a.section)?.name || a.section
          const bName =
            storeSections.find((s) => s.id === b.section)?.name || b.section
          return aName.localeCompare(bName)
        })
        .map((balanceRow: BalanceRowType) => (
          <View key={balanceRow.section}>
            <Pressable
              onPress={() => {
                handleSelectRow(balanceRow.section)
              }}
            >
              <ListRow
                style={{
                  marginVertical: 4,
                  backgroundColor:
                    selectedRow === balanceRow.section
                      ? 'lightblue'
                      : 'transparent'
                }}
                key={balanceRow.section}
                fields={table.map(({ width, field }) => {
                  const label = () => {
                    if (field === 'section') {
                      if (balanceRow[field] === 'all') {
                        return 'Todas'
                      }
                      if (balanceRow[field] === 'withoutSection') {
                        return 'Sin area'
                      }

                      return (
                        storeSections.find((s) => s.id === balanceRow[field])
                          ?.name || 'S/N'
                      )
                    }

                    if (field === 'reported') {
                      const reports = balanceRow['reported']?.length || 0
                      const solved = balanceRow['solvedToday']?.length || 0
                      return `${solved}/${reports}`
                    }

                    if (Array.isArray(balanceRow[field])) {
                      return balanceRow[field].length
                    }
                  }
                  return {
                    component: (
                      <Text
                        key={field}
                        numberOfLines={1}
                        style={[gStyles.tCenter]}
                      >
                        {label()}
                      </Text>
                    ),
                    width
                  }
                })}
              />
            </Pressable>
            {selectedRow === balanceRow.section && (
              <View>
                <Text style={gStyles.h2}>Detalles</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly'
                  }}
                >
                  <CellOrders
                    label={'Rentas'}
                    field="deliveredToday"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                    day={balance.createdAt}
                  />
                  <CellOrders
                    label={'Renovadas'}
                    field="renewedToday"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                    day={balance.createdAt}
                  />
                  <CellOrders
                    label={'Pagadas'}
                    field="paidToday"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                    day={balance.createdAt}
                  />
                  <CellOrders
                    label={'Recogidas'}
                    field="pickedUpToday"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                  />
                  <CellOrders
                    label={'Reportes pendientes'}
                    field="reported"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                  />
                  <CellOrders
                    label={'Reportes resueltos'}
                    field="solvedToday"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                  />
                  <CellOrders
                    label={'Canceladas'}
                    field="cancelledToday"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                  />
                  <CellOrders
                    label={'Todas'}
                    field="inRent"
                    sectionSelected={balanceRow.section}
                    sections={balance.sections}
                    hiddenList
                  />
                </View>
                <CellItemsE
                  items={
                    balance.sections.find((s) => s?.section === selectedRow)
                      ?.inStock
                  }
                  label="En carro"
                ></CellItemsE>
                <View>
                  <Text style={[gStyles.h2, { marginTop: 8 }]}>Pagos</Text>
                </View>
                <BalanceAmountsE payments={balanceRow.payments} />
              </View>
            )}
          </View>
        ))}
    </View>
  )
}

export const CellItemsE = (props: { items: string[]; label: string }) => {
  return (
    <ErrorBoundary componentName="CellItems">
      <CellItems {...props} />
    </ErrorBoundary>
  )
}

export const CellItems = ({
  items = [],
  label
}: {
  items: string[]
  label: string
}) => {
  //const { items: storeItems } = useStore()
  const { items: storeItems } = useEmployee()
  const { toItems } = useMyNav()

  return (
    <View>
      <Pressable
        onPress={() => {
          toItems({ ids: items })
        }}
      >
        <Text style={gStyles.h3}>
          {label}
          <Text style={gStyles.helper}>{`(${items?.length || 0})`}</Text>
        </Text>
      </Pressable>
      <View>
        {items?.map((itemId, index) => {
          const item = storeItems?.find((i) => i?.id === itemId)
          return (
            <Pressable
              key={item?.id || index}
              onPress={() => {
                toItems({ id: item?.id })
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text>{item?.categoryName} </Text>
                <Text>{item?.number} </Text>
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export const BusinessStatusE = (props: BusinessStatusProps) => (
  <ErrorBoundary componentName="BusinessStatus">
    <BusinessStatus {...props} />
  </ErrorBoundary>
)

export const CellOrdersE = (props: CellOrdersProps) => (
  <ErrorBoundary componentName="CellOrders">
    <CellOrders {...props} />
  </ErrorBoundary>
)
export type CellOrdersProps = {
  label: string
  sections: BalanceType2['sections']
  field: BalanceRowKeyType
  sectionSelected: string
  hiddenList?: boolean
  day?: Date | Timestamp
}
const CellOrders = ({
  label,
  sections,
  field,
  sectionSelected,
  hiddenList,
  day
}: CellOrdersProps) => {
  const section = sections?.find((s) => s.section === sectionSelected)
  const orders = section?.[field] as string[]
  const ordersUnique = removeDuplicates(orders)
  if (!orders.length) return null
  const { navigate } = useNavigation()
  return (
    <View style={{ margin: 4 }}>
      <Pressable
        onPress={() => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'ScreenOrders',
            params: {
              title: label,
              orders: orders
            }
          })
        }}
      >
        <Text style={gStyles.h3}>
          {label}
          <Text style={gStyles.helper}>({ordersUnique?.length || 0})</Text>
        </Text>
      </Pressable>

      {!hiddenList &&
        ordersUnique?.map((orderId) => {
          return (
            <SpanOrder
              key={orderId}
              orderId={orderId}
              showName
              showTime
              redirect
              showLastExtension
              showDatePaymentsAmount={day}
            />
          )
        })}
    </View>
  )
}

export default BusinessStatus
const removeDuplicates = (arr: string[]) => Array.from(new Set(arr))
