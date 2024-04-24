import React, { useMemo, useState } from 'react'
import { useField } from 'formik'
import FormSelectItem, { ItemSelected } from './FormSelectItem'
import { Category } from '../types/RentItem'
import Button from './Button'
import { FlatList, Text, View } from 'react-native'
import CurrencyAmount from './CurrencyAmount'
import { gSpace, gStyles } from '../styles'
import { v4 as uidGenerator } from 'uuid'
import theme from '../theme'
import Totals from './ItemsTotals'

const FormikSelectItems = ({
  name,
  label,
  categories,
  selectPrice,
  startAt,
  items = [],
  setItems
}: {
  name: string
  label?: string
  categories: Partial<Category>[]
  selectPrice?: boolean
  startAt?: Date
  setItems?: (items: ItemSelected[]) => void
  items?: ItemSelected[]
}) => {
  const [field, meta, helpers] = useField(name)
  const value: ItemSelected = useMemo(() => field.value, [field.value])
  const [_items, _setItems] = useState([...items])

  const handleRemoveItem = (id: string) => {
    const newItems = _items.filter((item) => item.id !== id)
    _setItems(newItems)
    setItems(newItems)
  }
  const handleAddItem = (value) => {
    value.id = uidGenerator()
    const newItems = [..._items, value]
    _setItems(newItems)
    setItems(newItems)
    helpers.setValue({})
  }

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
          const priceSelectedImportantInfo = {
            amount: priceSelected?.amount || null,
            title: priceSelected?.title || null,
            time: priceSelected?.time || null,
            id: priceSelected?.id || null
          }

          if (priceSelected) {
            handleAddItem({
              ...value,
              priceSelected: priceSelectedImportantInfo
            })
          }
        }}
        categories={categories}
        label={label}
        startAt={startAt}
        showCount={false}
        showDetails={false}
        // askItemInfo={true}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'center',
          marginTop: gSpace(2)
        }}
      >
        <Text style={{ marginRight: 4 }}>Artículos: </Text>
        <Text style={gStyles.h2}>{_items.length || 0}</Text>
      </View>
      <ListItems items={_items} handleRemoveItem={handleRemoveItem} />

      <Totals items={_items} />
    </>
  )
}

const ListItems = ({
  items,
  handleRemoveItem
}: {
  items: ItemSelected[]
  handleRemoveItem: (itemId: string) => void
}) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <ItemRow
          item={item}
          onPressDelete={() => handleRemoveItem(item.id)}
        ></ItemRow>
      )}
      keyExtractor={(item) => item.id}
    ></FlatList>
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
        alignItems: 'center',
        backgroundColor: theme.neutral,
        paddingHorizontal: gSpace(2),
        paddingVertical: gSpace(1),
        borderRadius: gSpace(2)
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
      <Text style={{ fontWeight: 'bold' }}>{item?.categoryName}</Text>
      <Text style={{ alignItems: 'center' }}>{item.priceSelected?.title}</Text>
      <CurrencyAmount
        style={{ fontWeight: 'bold' }}
        amount={item.priceSelected?.amount}
      />
    </View>
  )
}

export default FormikSelectItems
