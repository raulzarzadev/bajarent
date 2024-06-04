import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormBalance from './FormBalance'
import { useStore } from '../contexts/storeContext'
import { BalanceType } from '../types/BalanceType'
import BalanceInfo from './BalanceInfo'
import Button from './Button'
import { ServiceBalances } from '../firebase/ServiceBalances'
import { calculateSectionBalance } from '../libs/balance'
import { useAuth } from '../contexts/authContext'
import { gStyles } from '../styles'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ServicePayments } from '../firebase/ServicePayments'
import { where } from 'firebase/firestore'

const ScreenBalancesNew = ({ navigation }) => {
  const { storeId, store } = useStore()
  const { user } = useAuth()
  const [balance, setBalance] = React.useState<BalanceType>()

  const getSectionPayments = async ({ section, fromDate, toDate, type }) => {
    /* ******************************************** 
   //* Is necessary get the orders from the section to define section payments           
     *******************************************rz */

    // //* 1.- Filter payments by date from server

    const paymentsByDate = await ServicePayments.findMany([
      where('storeId', '==', storeId),
      where('createdAt', '>=', fromDate),
      where('createdAt', '<=', toDate)
    ])
    //* 2.- Find orders from payments, remove duplicates
    const paymentOrders = Array.from(
      new Set(paymentsByDate.map((p) => p.orderId))
    )

    let sectionOrders = []
    if (type === 'partial') {
      sectionOrders = await ServiceOrders.getList(paymentOrders, {
        sections: [section]
      })
    }
    if (type === 'full') {
      sectionOrders = await ServiceOrders.getList(paymentOrders)
    }
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
      const { payments, paidOrders } = await getSectionPayments({
        section: values.section,
        fromDate: values.fromDate,
        toDate: values.toDate,
        type: values.type
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
