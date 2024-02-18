import { Text, View, StyleSheet } from 'react-native'
import React from 'react'
import PaymentType from '../types/PaymentType'
import CurrencyAmount from './CurrencyAmount'
import dictionary from '../dictionary'
import DateCell from './DateCell'
import { gStyles } from '../styles'

const PaymentRow = ({ item }: { item: PaymentType }) => {
  return (
    <View style={styles.row}>
      <View style={{ width: 80 }}>
        <Text numberOfLines={3}>{item.clientName}</Text>
      </View>
      <DateCell date={item?.date} />
      <View style={{ width: 80 }}>
        <Text
          numberOfLines={1}
          style={{ textTransform: 'capitalize', textAlign: 'center' }}
        >
          {dictionary(item?.method)}
        </Text>
        {item?.reference && (
          <Text numberOfLines={1} style={[gStyles.tCenter, gStyles.helper]}>
            {item?.reference}
          </Text>
        )}
      </View>
      <View style={{ width: 80 }}>
        <CurrencyAmount amount={item?.amount} />
      </View>
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
