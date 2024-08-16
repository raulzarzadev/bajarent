import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { OrderQuoteType } from '../types/OrderType'
import Button from './Button'
import CurrencyAmount from './CurrencyAmount'
import { gStyles } from '../styles'
import ButtonConfirm from './ButtonConfirm'

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
              padding: 4,
              alignContent: 'center'
            }}
          >
            {quote.description}
          </Text>
          <View
            style={{
              width: 100,
              padding: 4,
              justifyContent: 'center'
            }}
          >
            <CurrencyAmount
              amount={quote.amount}
              style={{ textAlign: 'right' }}
            />
          </View>
          {handleRemoveQuote ? (
            <View style={{}}>
              <ButtonConfirm
                icon={'delete'}
                justIcon
                openColor="error"
                openSize="small"
                confirmColor="error"
                confirmVariant="outline"
                confirmLabel="Eliminar"
                text="¿Estás seguro de eliminar esta cotización?"
                handleConfirm={async () => {
                  return handleRemoveQuote(quote?.id)
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
        <View
          style={{
            width: 100,
            padding: 4,
            justifyContent: 'center'
          }}
        >
          <CurrencyAmount
            style={{ ...gStyles.h3, textAlign: 'right' }}
            amount={totalAmount}
          />
        </View>
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
