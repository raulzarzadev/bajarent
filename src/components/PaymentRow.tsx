import { Text, View, StyleSheet } from 'react-native'
import React from 'react'
import PaymentType from '../types/PaymentType'
import CurrencyAmount from './CurrencyAmount'
import dictionary from '../dictionary'
import DateCell from './DateCell'

const PaymentRow = ({ item }: { item: PaymentType }) => {
  return (
    <View style={styles.row}>
      <DateCell date={item?.date} />
      <Text style={{ textTransform: 'capitalize' }}>
        {dictionary(item?.method)}
      </Text>
      <CurrencyAmount amount={item?.amount} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    width: '100%'
  }
})

export default PaymentRow
