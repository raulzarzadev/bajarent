import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormBalance from './FormBalance'
import { useStore } from '../contexts/storeContext'
import { BalanceType } from '../types/BalanceType'
import asDate from '../libs/utils-date'

const ScreenBalancesNew = () => {
  const { payments } = useStore()
  const calculateBalance = async (values: BalanceType) => {
    const paymentsCount = values.userId
      ? payments.filter((p) => p.createdBy === values.userId)
      : payments

    const paymentsInDateRange = paymentsCount.filter(
      (p) =>
        asDate(p.createdAt).getTime() >= asDate(values.fromDate).getTime() &&
        asDate(p.createdAt).getTime() <= asDate(values.toDate).getTime()
    )
    console.log({ paymentsInDateRange })
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  const handleSetBalance = async (values: BalanceType) => {
    await calculateBalance(values)
  }
  return (
    <View>
      <FormBalance onSubmit={handleSetBalance} />
    </View>
  )
}

export default ScreenBalancesNew

const styles = StyleSheet.create({})
