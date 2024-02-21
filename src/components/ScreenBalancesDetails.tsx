import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { ServiceBalances } from '../firebase/ServiceBalances'
import DateCell from './DateCell'
import { BalanceType } from '../types/BalanceType'
import SpanUser from './SpanUser'
import dictionary from '../dictionary'
import BalanceInfo from './BalanceInfo'

const ScreenBalancesDetails = ({ route }) => {
  const [balance, setBalance] = React.useState<BalanceType>(null)
  useEffect(() => {
    console.log(route.params.id)
    const fetchBalance = async () => {
      const balance = await ServiceBalances.get(route?.params?.id)
      setBalance(balance)
    }
    fetchBalance()
  }, [])
  console.log({ balance })
  return (
    <View style={{ marginTop: 16 }}>
      <BalanceInfo balance={balance} />
    </View>
  )
}

export default ScreenBalancesDetails

const styles = StyleSheet.create({})
