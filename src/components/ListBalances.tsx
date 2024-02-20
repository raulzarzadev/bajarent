import { StyleSheet, Text, View } from 'react-native'
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
        onPressNew={() => {
          // @ts-ignore
          navigate('BalancesNew')
        }}
        data={balances}
        ComponentRow={RowBalance}
        filters={[]}
      />
    </View>
  )
}

export default ListBalances

const styles = StyleSheet.create({})
