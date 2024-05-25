import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormBalance from './FormBalance'
import { useStore } from '../contexts/storeContext'
import { BalanceType } from '../types/BalanceType'
import asDate from '../libs/utils-date'
import BalanceInfo from './BalanceInfo'
import Button from './Button'
import { ServiceBalances } from '../firebase/ServiceBalances'
import { calculateSectionBalance } from '../libs/balance'
import { useAuth } from '../contexts/authContext'
import { gStyles } from '../styles'
import { ServiceOrders } from '../firebase/ServiceOrders'

const ScreenBalancesNew = ({ navigation }) => {
  const { payments: storePayments, storeId, orders, store } = useStore()
  const { user } = useAuth()
  const [balance, setBalance] = React.useState<BalanceType>()

  // const getBalancePayments = async (values: BalanceType) => {
  //   const paymentsCount = values.userId
  //     ? storePayments.filter((p) => p.createdBy === values.userId)
  //     : storePayments

  //   const paymentsInDateRange = paymentsCount.filter(
  //     (p) =>
  //       asDate(p.createdAt).getTime() >= asDate(values.fromDate).getTime() &&
  //       asDate(p.createdAt).getTime() <= asDate(values.toDate).getTime()
  //   )
  //   return paymentsInDateRange
  // }
  const getSectionPayments = async ({ section, fromDate, toDate }) => {
    /* ******************************************** 
   //* Is necessary get the orders from the section to define section payments           
     *******************************************rz */
    //* 1.- Filter payments by date
    const paymentsByDate = storePayments.filter(
      (p) =>
        asDate(p.createdAt).getTime() >= asDate(fromDate).getTime() &&
        asDate(p.createdAt).getTime() <= asDate(toDate).getTime()
    )
    //* 2.- Find orders from payments
    const paymentOrders = Array.from(
      new Set(paymentsByDate.map((p) => p.orderId))
    )
    const sectionOrders = await ServiceOrders.getList(paymentOrders, {
      sections: [section]
    })
    //* 3.- Set orders with payments
    const ordersWithPayments = sectionOrders.map((o) => {
      const orderPayments = paymentsByDate.filter((p) => p.orderId === o.id)
      return { ...o, payments: orderPayments }
    })

    //* 3.- Need paid orders and payments in dates
    const paidOrders = ordersWithPayments
    const payments = ordersWithPayments.map((o) => o.payments).flat()
    return { paidOrders, payments }
  }

  const handleCalculateBalance = async (values: BalanceType) => {
    try {
      //const payments = await getBalancePayments(values)
      const { payments, paidOrders } = await getSectionPayments({
        section: values.section,
        fromDate: values.fromDate,
        toDate: values.toDate
      })
      //const orders = await balanceOrders({ values, storeId })
      const orders = await calculateSectionBalance({
        storeId,
        fromDate: values.fromDate,
        toDate: values.toDate,
        section: values.section,
        type: values.type
      })

      setBalance({
        ...values,
        payments,
        ...orders,
        paidOrders: paidOrders.map((o) => o.id)
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
    navigation.navigate('ScreenBalancesDetails', { id: res?.res?.id })
  }
  const handleClear = () => {
    setBalance(undefined)
  }
  if (!storeId || !store || !user) return <Text>Cargando...</Text>
  console.log({ balance })
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
