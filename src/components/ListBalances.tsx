import { StyleSheet, View } from 'react-native'
import React from 'react'
import List from './List'
import RowBalance from './RowBalace'
import { BalanceType } from '../types/BalanceType'
import { useNavigation } from '@react-navigation/native'

const ListBalances = ({ balances }: { balances: BalanceType[] }) => {
  const { navigate } = useNavigation()
  return (
    <View>
      <List
        onPressRow={(id) => {
          // @ts-ignore
          navigate('BalancesDetails', { id })
        }}
        onPressNew={() => {
          // @ts-ignore
          navigate('BalancesNew')
        }}
        sortFields={[
          {
            key: 'createdAt',
            label: 'Fecha'
          },
          {
            key: 'fromDate',
            label: 'Desde'
          },
          {
            key: 'toDate',
            label: 'Hasta'
          },
          {
            key: 'type',
            label: 'Tipo'
          },
          {
            key: 'userId',
            label: 'Usuario'
          }
        ]}
        data={balances}
        ComponentRow={RowBalance}
        filters={[
          { field: 'type', label: 'Tipo' },
          { field: 'userId', label: 'Usuario' }
        ]}
      />
    </View>
  )
}

export default ListBalances

const styles = StyleSheet.create({})
