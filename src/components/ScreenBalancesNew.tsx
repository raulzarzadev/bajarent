import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import FormBalance from './FormBalance'
import { useStore } from '../contexts/storeContext'
import { BalanceOrders, BalanceType } from '../types/BalanceType'
import asDate from '../libs/utils-date'
import BalanceInfo from './BalanceInfo'
import Button from './Button'
import { ServiceBalances } from '../firebase/ServiceBalances'
import OrderType, { order_status } from '../types/OrderType'

const ScreenBalancesNew = ({ navigation }) => {
  const { payments, storeId, orders } = useStore()
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

  const getBalanceOrders = async (
    values: BalanceType
  ): Promise<BalanceOrders> => {
    const ordersByDate = orders.filter((o) => {
      //* filter orders by date
      const createdAt = asDate(o.createdAt)
      const fromDate = asDate(values.fromDate)
      const toDate = asDate(values.toDate)

      return (
        createdAt.getTime() >= fromDate.getTime() &&
        createdAt.getTime() <= toDate.getTime()
      )
    })
    const ordersCreated = ordersByDate.filter((o) => {
      //* if userId is set, only show orders created by that user
      if (values.userId) return o.createdBy === values.userId
      return true
    })

    const ordersPickup = orders
      .filter((o) => {
        const pickedUpAt = asDate(o.pickedUpAt)
        const fromDate = asDate(values.fromDate)
        const toDate = asDate(values.toDate)
        if (!pickedUpAt) return false
        return (
          pickedUpAt.getTime() >= fromDate.getTime() &&
          pickedUpAt.getTime() <= toDate.getTime()
        )
      })
      .filter((o) => {
        if (values.userId) return o.pickedUpBy === values.userId
        return true
      })

    const ordersDelivered = orders
      .filter((o) =>
        [order_status.DELIVERED, order_status.REPAIR_DELIVERED].includes(
          o.status
        )
      )

      .filter((o) => {
        const deliveredAt = asDate(o.deliveredAt)
        const fromDate = asDate(values.fromDate)
        const toDate = asDate(values.toDate)
        if (!deliveredAt) return false
        return (
          deliveredAt.getTime() >= fromDate.getTime() &&
          deliveredAt.getTime() <= toDate.getTime()
        )
      })
      .filter((o) => {
        if (values.userId) return o.deliveredBy === values.userId
        return o.deliveredAt
      })
    const ordersIds = (orders: OrderType[]) => orders.map((o) => o.id)
    return {
      ordersCreated: ordersIds(ordersCreated),
      ordersPickup: ordersIds(ordersPickup),
      ordersDelivered: ordersIds(ordersDelivered)
    }
  }
  const handleCalculateBalance = async (values: BalanceType) => {
    try {
      const payments = await getBalancePayments(values)
      const orders = await getBalanceOrders(values)
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
  return (
    <ScrollView>
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
    </ScrollView>
  )
}

export default ScreenBalancesNew

const styles = StyleSheet.create({})
