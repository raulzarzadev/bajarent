import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export type QuoteType = {
  description?: string
  amount?: number
}
export type QuotesType = QuoteType[]
const ListOrderQuotes = ({ quotes = [] }: { quotes: QuotesType }) => {
  return (
    <View>
      {quotes?.map((quote, i) => (
        <View key={i}>
          <Text>{quote.description}</Text>
          <Text>{quote.amount}</Text>
        </View>
      ))}
    </View>
  )
}

export default ListOrderQuotes

const styles = StyleSheet.create({})
