import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import FormBalance from './FormBalance'
import { useStore } from '../contexts/storeContext'
import { BalanceType } from '../types/BalanceType'
import asDate from '../libs/utils-date'
import BalanceInfo from './BalanceInfo'
import Button from './Button'
import { ServiceBalances } from '../firebase/ServiceBalances'

const ScreenBalancesNew = () => {
  const { payments, storeId } = useStore()
  const [balance, setBalance] = React.useState<BalanceType>()
  // const [balancePayments, setBalancePayments] = React.useState<
  //   BalanceType['payments']
  // >([])
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
  const handleSetBalance = async (values: BalanceType) => {
    const payments = await getBalancePayments(values)
    setBalance({
      ...values,
      payments
    })
  }

  const [saving, setSaving] = React.useState(false)

  const handleSaveBalance = async () => {
    setSaving(true)
    balance.storeId = storeId
    await ServiceBalances.create(balance)
    setSaving(false)
  }
  return (
    <ScrollView>
      <FormBalance onSubmit={handleSetBalance} />
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
    </ScrollView>
  )
}

export default ScreenBalancesNew

const styles = StyleSheet.create({})
