import { View, Text } from 'react-native'
import React from 'react'
import ListRow, { ListRowField } from './ListRow'
import { BalanceRowType, BalanceType2 } from '../types/BalanceType'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'

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
      field: 'pickedUpToday',
      label: 'RECOGIDAS',
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
  return (
    <View style={{ padding: 6 }}>
      {/* HEADER */}
      <ListRow
        fields={table.map(({ label, width }) => ({
          component: (
            <Text style={[gStyles.tBold, gStyles.helper]}>{label}</Text>
          ),
          width
        }))}
      />
      {/* ROWS */}
      {balance?.sections?.map((balanceRow: BalanceRowType) => (
        <ListRow
          style={{ marginVertical: 4 }}
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
                  storeSections.find((s) => s.id === balanceRow[field])?.name ||
                  'Sin Nombre'
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
              component: <Text>{label()}</Text>,
              width
            }
          })}
        />
      ))}
    </View>
  )
}

export default BusinessStatus
