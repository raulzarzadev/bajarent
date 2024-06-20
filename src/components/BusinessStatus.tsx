import { View, Text, Pressable } from 'react-native'
import React from 'react'
import ListRow, { ListRowField } from './ListRow'
import {
  BalanceRowKeyType,
  BalanceRowType,
  BalanceType2
} from '../types/BalanceType'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import { useOrdersCtx } from '../contexts/ordersContext'
import { ConsolidatedOrderType } from '../firebase/ServiceConsolidatedOrders'
import { currentRentPeriod } from '../libs/orders'
import { useNavigation } from '@react-navigation/native'

const BusinessStatus = ({ balance }: { balance: Partial<BalanceType2> }) => {
  const { storeSections } = useStore()
  const table: {
    field: keyof BalanceRowType
    label: string
    width: ListRowField['width']
  }[] = [
    { field: 'section', label: 'AREA', width: 'rest' },
    {
      field: 'pending',
      label: 'PEDIDOS',
      width: 'rest'
    },
    {
      field: 'deliveredToday',
      label: 'ENTREGADAS',
      width: 'rest'
    },
    {
      field: 'pickedUpToday',
      label: 'RECOGIDAS',
      width: 'rest'
    },
    {
      field: 'renewedToday',
      label: 'RENOVADAS',
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
      label: 'EN STOCK',
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
      {balance?.sections?.map((balanceRow: BalanceRowType) => (
        <>
          <Pressable
            key={balanceRow.section}
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
                        ?.name || 'Sin Nombre'
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
                  label={'Entregadas'}
                  field="deliveredToday"
                  sectionSelected={balanceRow.section}
                  sections={balance.sections}
                />
                <CellOrders
                  label={'Renovadas'}
                  field="renewedToday"
                  sectionSelected={balanceRow.section}
                  sections={balance.sections}
                />
                <CellOrders
                  label={'Recogidas'}
                  field="pickedUpToday"
                  sectionSelected={balanceRow.section}
                  sections={balance.sections}
                />
                <CellOrders
                  label={'Reportes'}
                  field="reported"
                  sectionSelected={balanceRow.section}
                  sections={balance.sections}
                />
                <CellOrders
                  label={'Resueltdos'}
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
              </View>
            </View>
          )}
        </>
      ))}
    </View>
  )
}

const CellOrders = ({
  label,
  sections,
  field,
  sectionSelected
}: {
  label: string
  sections: BalanceType2['sections']
  field: BalanceRowKeyType
  sectionSelected: string
}) => {
  const { consolidatedOrders } = useOrdersCtx()
  const { navigate } = useNavigation()
  const section = sections?.find((s) => s.section === sectionSelected)
  const orders = section?.[field] as string[]
  return (
    <View>
      <Text style={gStyles.h3}>{label}</Text>
      {orders?.map((orderId) => {
        const order: Partial<ConsolidatedOrderType> =
          consolidatedOrders?.orders?.[orderId]
        return (
          <Pressable
            key={orderId}
            onPress={() => {
              //@ts-ignore
              navigate('StackOrders', {
                screen: 'OrderDetails',
                params: { orderId: orderId }
              })
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ marginHorizontal: 4 }}>
                {order?.folio}
                {order?.note}
              </Text>
              <Text style={{ marginHorizontal: 4 }}>{order?.fullName}</Text>
              <Text style={{ marginHorizontal: 4 }}>
                {currentRentPeriod(order, { shortLabel: true })}
              </Text>
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

export default BusinessStatus
