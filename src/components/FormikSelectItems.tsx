import React, { useEffect, useMemo, useState } from 'react'
import { useField } from 'formik'
import FormSelectItem, { ItemSelected } from './FormSelectItem'
import { Category } from '../types/RentItem'
import Button from './Button'
import { FlatList, Text, View } from 'react-native'
import CurrencyAmount from './CurrencyAmount'
import { gSpace, gStyles } from '../styles'
import { v4 as uidGenerator } from 'uuid'
import { TypeOrderKey } from '../types/OrderType'
import { set } from 'cypress/types/lodash'

const FormikSelectItems = ({
  name,
  label,
  categories,
  selectPrice,
  startAt,
  items = [],
  setItems,
  orderType
}: {
  name: string
  label?: string
  categories: Partial<Category>[]
  selectPrice?: boolean
  startAt?: Date
  setItems?: (items: ItemSelected[]) => void
  items?: ItemSelected[]
  orderType?: TypeOrderKey
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

  useEffect(() => {
    _setItems([]) //* <- should reset items if change order type
    setItems([]) //* <- should reset items if change order type
  }, [orderType])

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
            amount: priceSelected?.amount,
            title: priceSelected?.title,
            time: priceSelected?.time,
            id: priceSelected?.id
          }
          helpers.setValue({
            ...value,
            priceSelected: priceSelectedImportantInfo
          })
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
      <ListItems items={_items} handleRemoveItem={handleRemoveItem} />

      {!!selectPrice && (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'center'
            }}
          >
            <Text style={{ marginRight: 4 }}>Items: </Text>
            <Text style={gStyles.h2}>{_items.length || 0}</Text>
          </View>
          <Totals items={_items} />
        </>
      )}
    </>
  )
}

export const Totals = ({ items }: { items: ItemSelected[] }) => {
  const total = items.reduce((acc, item) => acc + item.priceSelected?.amount, 0)

  return (
    <View style={{ justifyContent: 'center', marginBottom: gSpace(4) }}>
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
