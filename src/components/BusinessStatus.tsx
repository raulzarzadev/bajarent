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
import { BalanceAmountsE } from './BalanceAmounts'
import ErrorBoundary from './ErrorBoundary'
import SpanOrder from './SpanOrder'

export type BusinessStatusProps = { balance: Partial<BalanceType2> }
const BusinessStatus = ({ balance }: BusinessStatusProps) => {
  const { storeSections } = useStore()
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
                  label={'Rentas'}
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
                  label={'Pagadas'}
                  field="paidToday"
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
}
const CellOrders = ({
  label,
  sections,
  field,
  sectionSelected
}: CellOrdersProps) => {
  const section = sections?.find((s) => s.section === sectionSelected)
  const orders = section?.[field] as string[]
  if (!orders.length) return null
  return (
    <View style={{ margin: 4 }}>
      <Text style={gStyles.h3}>
        {label}
        <Text style={gStyles.helper}>({orders?.length || 0})</Text>
      </Text>
      {orders?.map((orderId) => {
        return <SpanOrder key={orderId} orderId={orderId} name time redirect />
      })}
    </View>
  )
}

export default BusinessStatus
