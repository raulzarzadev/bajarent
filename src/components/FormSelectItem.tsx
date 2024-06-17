import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native'
import React, { useEffect, useState } from 'react'
import InputRadios from './InputRadios'
import theme from '../theme'
import CurrencyAmount from './CurrencyAmount'
import P from './P'
import { CategoryType } from '../types/RentItem'
import { PriceType } from '../types/PriceType'
import InputCount from './InputCount'
import { gSpace, gStyles } from '../styles'
import DateCell from './DateCell'
import { expireDate2 } from '../libs/expireDate'
import InputTextStyled from './InputTextStyled'

export type ItemSelected = {
  categoryName?: string
  priceSelectedId?: string
  priceQty?: number
  priceSelected?: Partial<PriceType>
  id?: string
  brand?: string
  serial?: string
  number?: string
  // priceId?: string
  // timestamp?: Date
}

const FormSelectItem = ({
  categories = [],
  setValue,
  value,
  label = 'Categorias',
  selectPrice = false,
  startAt,
  showDetails = true,
  showCount = true,
  askItemInfo = false
}: {
  categories: Partial<CategoryType>[]
  setValue: (value: ItemSelected) => void
  value: ItemSelected
  label?: string
  selectPrice?: boolean
  startAt?: Date
  showDetails?: boolean
  showCount?: boolean
  askItemInfo?: boolean
}) => {
  const [brand, setBrand] = useState<string | null>(null)
  const [serial, setSerial] = useState<string | null>(null)

  const [categoryId, setCategoryId] = useState<
    ItemSelected['categoryName'] | null
  >(value?.categoryName || null)

  useEffect(() => {
    setCategoryId(value?.categoryName)
  }, [value?.categoryName])

  const [priceId, setPriceId] = useState<
    ItemSelected['priceSelectedId'] | null
  >(value?.priceSelectedId || null)
  const [amount, setAmount] = useState<number | null>(null)

  const [shouldExpireAt, setShouldExpireAt] = useState<Date | null>(null)

  const prices =
    categories?.find((category) => category?.name === categoryId)?.prices || []

  const handleSelectPrice = (priceId: string) => {
    if (priceId === value.priceSelectedId) {
      setPriceId(null)
      setValue({
        categoryName: categoryId,
        priceSelectedId: null,
        priceQty: 0,
        brand,
        serial
      })
    } else {
      setPriceId(priceId)
      setValue({
        categoryName: categoryId,
        priceSelectedId: priceId,
        priceQty: 1,
        brand,
        serial
      })
    }
  }

  const handleSelectCategory = (item: string) => {
    setCategoryId(item)
    setValue({ categoryName: item as string, priceSelectedId: null })
  }

  const handleSetQty = (qty: number) => {
    setValue({ ...value, priceQty: qty })
  }

  useEffect(() => {
    const total = (value?.priceQty || 0) * (value?.priceSelected?.amount || 0)
    setAmount(total)
  }, [value])

  useEffect(() => {
    const expireAt = expireDate2(
      {
        startedAt: startAt || new Date(),
        price: value?.priceSelected,
        priceQty: value?.priceQty || 0
      }
      // value?.priceSelected?.time,
      // startAt || new Date(),
      // value?.priceSelected,
      // value?.priceQty || 0
    )
    setShouldExpireAt(expireAt)
  }, [amount, startAt])

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
            handleSelectCategory(item)
          }}
          value={categoryId}
          label={label}
          containerStyle={{ flexWrap: 'wrap', justifyContent: 'center' }}
        />
      </View>
      {askItemInfo && value?.categoryName && (
        <View style={{ marginVertical: gSpace(2) }}>
          <InputTextStyled
            placeholder="Marca"
            value={brand}
            onChangeText={(text) => setBrand(text)}
            helperText="Ejemplo: HP, Mytag, Mac, etc."
            containerStyle={{ marginBottom: gSpace(2) }}
          />
          <InputTextStyled
            placeholder="No. de serie"
            value={serial}
            onChangeText={(text) => setSerial(text)}
            helperText="Ejemplo: ABC-34567890, 0987654321, etc."
          />
        </View>
      )}
      {selectPrice && (
        <View>
          <FormSelectPrice
            value={priceId || null}
            setValue={(priceId) => {
              handleSelectPrice(priceId)
            }}
            prices={prices}
          />
        </View>
      )}

      {showCount && !!value?.priceSelected && (
        <View style={{ marginVertical: gSpace(2) }}>
          <InputCount
            value={value?.priceQty || 0}
            setValue={handleSetQty}
            label="Cantidad"
          />
          <Text style={[gStyles.helper, gStyles.tCenter]}>
            Agrega tiempo a este item
          </Text>
        </View>
      )}
      {showDetails && (
        <>
          {!!amount && <CurrencyAmount amount={amount} style={gStyles.h1} />}
          {!!amount && shouldExpireAt && (
            <View style={{ alignItems: 'center', alignContent: 'center' }}>
              <Text>Vence:</Text>
              <DateCell date={shouldExpireAt} />
            </View>
          )}
        </>
      )}
    </View>
  )
}
const FormSelectPrice = ({
  prices,
  value,
  setValue
}: {
  prices: Partial<PriceType>[]
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
                selected={value === item.id}
                style={{
                  marginRight: 8,
                  marginVertical: 8
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

export const CardPrice = ({
  price,
  style,
  selected
}: {
  price: Partial<PriceType>
  style?: ViewStyle
  selected?: boolean
}) => {
  return (
    <View
      style={[
        styles.price,
        style,
        { borderColor: selected ? theme.secondary : 'transparent' }
      ]}
    >
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
