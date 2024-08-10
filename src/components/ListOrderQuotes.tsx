import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { OrderQuoteType } from '../types/OrderType'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import { gStyles } from '../styles'

const ListOrderQuotes = ({
  quotes = [],
  handleRemoveQuote
}: {
  quotes: OrderQuoteType[]
  handleRemoveQuote?: (id: string) => Promise<void> | void
}) => {
  const totalAmount = quotes.reduce(
    (acc, quote) => acc + (parseFloat(`${quote?.amount}`) || 0),
    0
  )
  return (
    <View>
      {quotes?.map((quote, i) => (
        <View key={i} style={{ flexDirection: 'row', padding: 6 }}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              padding: 4
            }}
          >
            {quote.description}
          </Text>
          <Text
            style={{
              width: 100,
              padding: 4
            }}
          >
            <CurrencyAmount amount={quote.amount} />
          </Text>
          {handleRemoveQuote ? (
            <View
              style={{
                width: 60,
                padding: 4
              }}
            >
              <Button
                icon={'delete'}
                justIcon
                color="error"
                size="small"
                onPress={() => {
                  handleRemoveQuote(quote?.id)
                }}
              />
            </View>
          ) : null}
        </View>
      ))}
      <View style={{ flexDirection: 'row', padding: 6 }}>
        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            padding: 4
          }}
        >
          Total:
        </Text>
        <Text
          style={{
            width: 100,
            padding: 4
          }}
        >
          <CurrencyAmount style={gStyles.h3} amount={totalAmount} />
        </Text>
      </View>
    </View>
  )
}

export default ListOrderQuotes

const styles = StyleSheet.create({
  cell: {
    width: '33.3%'
  }
})
