import React, { useMemo, useState } from 'react'
import { useField } from 'formik'
import FormSelectItem, { ItemSelected } from './FormSelectItem'
import { Category } from '../types/RentItem'
import Button from './Button'
import { FlatList, Text, View } from 'react-native'
import CurrencyAmount from './CurrencyAmount'
import { gSpace, gStyles } from '../styles'
import { v4 as uidGenerator } from 'uuid'

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

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }
  const handleAddItem = (value) => {
    value.id = uidGenerator()
    setItems([...items, value])
    helpers.setValue({})
  }

  const total = items.reduce((acc, item) => acc + item.priceSelected?.amount, 0)

  return (
    <>
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
          if (priceSelected) {
            handleAddItem({ ...value, priceSelected })
          }
        }}
        categories={categories}
        label={label}
        startAt={startAt}
        showCount={false}
        showDetails={false}
      />

      <FlatList
        style={{ marginVertical: gSpace(2) }}
        data={items}
        renderItem={({ item, index }) => (
          <ItemRow
            item={item}
            onPressDelete={() => handleRemoveItem(item.id)}
          ></ItemRow>
        )}
        keyExtractor={(item) => item.id}
      ></FlatList>

      <View style={{ justifyContent: 'center', marginBottom: gSpace(4) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'center'
          }}
        >
          <Text style={{ marginRight: 4 }}>Items: </Text>
          <Text>{items.length || 0}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ textAlign: 'center', marginRight: 4 }}> Total: </Text>
          <CurrencyAmount style={gStyles.h1} amount={total} />
        </View>
      </View>
      {value?.categoryName && value.priceSelectedId && (
        <Button
          label="Agregar item"
          onPress={() => {
            handleAddItem(value)
          }}
        ></Button>
      )}
    </>
  )
}

const ItemRow = ({
  item,
  onPressDelete
}: {
  item: ItemSelected
  onPressDelete: () => void
}) => {
  return (
    <View
      style={{
        width: '100%',
        marginVertical: gSpace(2),
        justifyContent: 'space-between',
        flexDirection: 'row',
        maxWidth: 320,
        marginHorizontal: 'auto',
        alignItems: 'center'
      }}
    >
      <View>
        <Button
          icon="sub"
          color="error"
          justIcon
          onPress={onPressDelete}
          size="small"
        />
      </View>
      <Text style={gStyles.h3}>{item?.categoryName}</Text>
      <Text>{item.priceSelected?.title}</Text>
      <CurrencyAmount style={gStyles.h3} amount={item.priceSelected?.amount} />
    </View>
  )
}

export default FormikSelectCategoryItems
