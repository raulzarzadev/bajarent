import { StyleSheet, Text, TextStyle } from 'react-native'
import React from 'react'

const CurrencyAmount = ({
  amount = 0,
  style
}: {
  amount: number
  style?: TextStyle
}) => {
  return (
    <Text style={[style]}>
      {amount?.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
      })}
    </Text>
  )
}

export default CurrencyAmount

const styles = StyleSheet.create({})
