import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormBalance from './FormBalance'
import { useStore } from '../contexts/storeContext'
import { BalanceOrders, BalanceType } from '../types/BalanceType'
import asDate from '../libs/utils-date'
import BalanceInfo from './BalanceInfo'
import Button from './Button'
import { ServiceBalances } from '../firebase/ServiceBalances'
import { balanceOrders } from '../libs/balance'
import { useAuth } from '../contexts/authContext'
import { gStyles } from '../styles'

const ScreenBalancesNew = ({ navigation }) => {
  const { payments, storeId, orders, store } = useStore()
  const { user } = useAuth()
  const [balance, setBalance] = React.useState<BalanceType>()

  const getBalancePayments = async (values: BalanceType) => {
    const paymentsCount = values.userId
      ? payments.filter((p) => p.createdBy === values.userId)
      : payments

    const paymentsInDateRange = paymentsCount.filter(
      (p) =>
        asDate(p.createdAt).getTime() >= asDate(values.fromDate).getTime() &&
        asDate(p.createdAt).getTime() <= asDate(values.toDate).getTime()
    )
    return paymentsInDateRange
  }

  const handleCalculateBalance = async (values: BalanceType) => {
    try {
      const payments = await getBalancePayments(values)
      const orders = await balanceOrders({ values })
      setBalance({
        ...values,
        payments,
        ...orders
      })
    } catch (error) {
      console.error(error)
    }
  }

  const [saving, setSaving] = React.useState(false)

  const handleSaveBalance = async () => {
    setSaving(true)
    balance.storeId = storeId
    const res = await ServiceBalances.create(balance)
    setSaving(false)
    navigation.navigate('BalancesDetails', { id: res?.res?.id })
  }
  const handleClear = () => {
    setBalance(undefined)
  }
  if (!storeId || !store || !user) return <Text>Cargando...</Text>

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <FormBalance
          onSubmit={handleCalculateBalance}
          handleClear={handleClear}
        />

        {!!balance && <BalanceInfo balance={balance} hideMetadata />}
        {!!balance && (
          <View style={{ maxWidth: 200, margin: 'auto', marginVertical: 8 }}>
            <Button
              disabled={saving}
              label="Guardar"
              onPress={handleSaveBalance}
            ></Button>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ScreenBalancesNew

const styles = StyleSheet.create({})
