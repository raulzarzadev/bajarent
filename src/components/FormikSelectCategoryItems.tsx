import React, { useMemo, useState } from 'react'
import { useField } from 'formik'
import FormSelectItem, { ItemSelected } from './FormSelectItem'
import { Category } from '../types/RentItem'
import Button from './Button'
import { FlatList, Text, View } from 'react-native'
import CurrencyAmount from './CurrencyAmount'
import { gSpace, gStyles } from '../styles'

const FormikSelectCategoryItems = ({
  name,
  label,
  categories,
  selectPrice,
  startAt
}: {
  name: string
  label?: string
  categories: Partial<Category>[]
  selectPrice?: boolean
  startAt?: Date
}) => {
  const [field, meta, helpers] = useField(name)
  const value: ItemSelected = useMemo(() => field.value, [field.value])
  const [items, setItems] = useState([])

  console.log({ value })

  return (
    <>
      <FlatList
        data={items}
        renderItem={({ item }) => <ItemRow item={item}></ItemRow>}
        keyExtractor={(item) => item.categoryName}
      ></FlatList>
      <FormSelectItem
        selectPrice={selectPrice}
        value={value}
        setValue={(value) => {
          const priceSelected =
            categories
              ?.find((category) => category?.name === value?.categoryName)
              ?.prices?.find((price) => price?.id === value?.priceSelectedId) ||
            null
          helpers.setValue({
            ...value,
            priceSelected
          })
        }}
        categories={categories}
        label={label}
        startAt={startAt}
      />
      {value?.categoryName && value.priceSelectedId && (
        <Button
          label="Agregar item"
          onPress={() => {
            setItems([...items, value])
            helpers.setValue({})
          }}
        ></Button>
      )}
    </>
  )
}

const ItemRow = ({ item }: { item: ItemSelected }) => {
  return (
    <View
      style={{
        width: '100%',
        marginVertical: gSpace(2),
        justifyContent: 'space-between',
        flexDirection: 'row',
        maxWidth: 280
      }}
    >
      <Text style={gStyles.h3}>{item?.categoryName}</Text>
      <Text style={gStyles.h3}>{item.priceSelected?.time}</Text>
      <CurrencyAmount amount={item.priceSelected?.amount} />
    </View>
  )
}

export default FormikSelectCategoryItems
