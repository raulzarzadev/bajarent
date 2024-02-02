import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native'
import React, { useState } from 'react'
import InputRadios from './InputRadios'
import theme from '../theme'
import CurrencyAmount from './CurrencyAmount'
import P from './P'
import { Category, PriceType } from '../types/RentItem'

export type ItemSelected = {
  categoryName?: string
  priceSelectedId?: string
  // priceId?: string
  // timestamp?: Date
}

const FormSelectItem = ({
  categories = [],
  setValue,
  value,
  label = 'Categorias',
  selectPrice = false
}: {
  categories: Category[]
  setValue: (value: ItemSelected) => void
  value: ItemSelected
  label?: string
  selectPrice?: boolean
}) => {
  const [categoryId, setCategoryId] = useState<
    ItemSelected['categoryName'] | null
  >(value?.categoryName || null)

  const [priceId, setPriceId] = useState<
    ItemSelected['priceSelectedId'] | null
  >(value?.priceSelectedId || null)

  const prices =
    categories?.find((category) => category?.name === categoryId)?.prices || []

  return (
    <View>
      <View>
        <InputRadios
          layout="row"
          options={categories.map((category) => ({
            label: category?.name,
            value: category?.name
          }))}
          setValue={(item) => {
            setCategoryId(item)
            setValue({ categoryName: item, priceSelectedId: null })
          }}
          value={categoryId}
          label={label}
        />
      </View>
      {selectPrice && (
        <View>
          <FormSelectPrice
            value={priceId || null}
            setValue={(priceId) => {
              setPriceId(priceId)
              setValue({ categoryName: categoryId, priceSelectedId: priceId })
            }}
            prices={prices}
          />
        </View>
      )}
    </View>
  )
}
const FormSelectPrice = ({
  prices,
  value,
  setValue
}: {
  prices: PriceType[]
  value: PriceType['id'] | null
  setValue: (value: PriceType['id']) => void
}) => {
  return (
    <>
      <View>
        {!!prices.length && (
          <P bold size="lg">
            Precios
          </P>
        )}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <FlatList
          data={prices}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              onPress={() => {
                setValue(item.id)
              }}
            >
              <CardPrice
                price={item}
                style={{
                  marginRight: 8,
                  marginVertical: 8,
                  borderColor:
                    value === item.id ? theme.secondary : 'transparent'
                }}
              />
            </Pressable>
          )}
          keyExtractor={(item) => item.title}
          horizontal
        ></FlatList>
      </View>
    </>
  )
}

const CardPrice = ({
  price,
  style
}: {
  price: PriceType
  style: ViewStyle
}) => {
  return (
    <View style={[styles.price, style]}>
      <Text style={{ textAlign: 'center', marginBottom: 4 }}>
        {price.title}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        <CurrencyAmount amount={price.amount || 0} />
      </Text>
    </View>
  )
}

export default FormSelectItem

const styles = StyleSheet.create({
  price: {
    width: 100,
    aspectRatio: '2/1',
    backgroundColor: theme.primary,
    borderRadius: 8,
    // borderColor: theme.secondary,
    borderColor: 'black',
    borderWidth: 2,
    shadowColor: theme.black,
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowRadius: 4,
    shadowOpacity: 0.25,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
