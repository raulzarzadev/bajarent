import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { ServiceBalances } from '../firebase/ServiceBalances'
import DateCell from './DateCell'
import { BalanceType } from '../types/BalanceType'
import SpanUser from './SpanUser'
import dictionary from '../dictionary'
import BalanceInfo from './BalanceInfo'
import ButtonConfirm from './ButtonConfirm'
import theme from '../theme'

const ScreenBalancesDetails = ({ route, navigation }) => {
  const [balance, setBalance] = React.useState<BalanceType>(null)
  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await ServiceBalances.get(route?.params?.id)
      setBalance(balance)
    }
    fetchBalance()
  }, [])
  return (
    <View style={{ marginTop: 16 }}>
      <BalanceInfo balance={balance} />
      <View
        style={{
          justifyContent: 'center',
          width: 245,
          margin: 'auto',
          marginVertical: 16
        }}
      >
        <ButtonConfirm
          icon="delete"
          confirmLabel="Eliminar"
          confirmColor="error"
          openVariant="outline"
          openLabel={'Eliminar'}
          openColor="error"
          text="¿Estás seguro de eliminar este balance?"
          handleConfirm={async () => {
            return await ServiceBalances.delete(balance.id).then(() => {
              navigation.goBack()
            })
          }}
        />
      </View>
    </View>
  )
}

export default ScreenBalancesDetails

const styles = StyleSheet.create({})
