import { View, Text } from 'react-native'
import React from 'react'
import ListRow, { ListRowField } from './ListRow'
import { BalanceType } from '../types/BalanceType'
import { gStyles } from '../styles'
export type BalanceRowType = {
  section: string
  pending: string[]
  delivered: string[]
  renewed: string[]
  reports: string[]
  cancelled: string[]
  pickedUp: string[]
  rented: string[]
  inStock: string[]
}
export type BalanceType_V2 = {
  sections: BalanceRowType[]
}
const BusinessStatus = ({ balance }: { balance: BalanceType_V2 }) => {
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
      field: 'delivered',
      label: 'ENTREGADAS',
      width: 'rest'
    },
    {
      field: 'renewed',
      label: 'RENOVADAS',
      width: 'rest'
    },
    {
      field: 'reports',
      label: 'REPORTE',
      width: 'rest'
    },
    {
      field: 'cancelled',
      label: 'CANCELADAS',
      width: 'rest'
    },
    {
      field: 'pickedUp',
      label: 'RECOGIDAS',
      width: 'rest'
    },
    {
      field: 'rented',
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
    <View>
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
          fields={table.map(({ width, field }) => ({
            component: <Text>{balanceRow[field]}</Text>,
            width
          }))}
        />
      ))}
    </View>
  )
}

export default BusinessStatus
