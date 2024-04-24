import React, { useEffect, useMemo, useState } from 'react'
import { useField } from 'formik'
import { ItemSelected } from './FormSelectItem'
import { CategoryType } from '../types/RentItem'
import Button from './Button'
import { FlatList, Text, View } from 'react-native'
import CurrencyAmount from './CurrencyAmount'
import { gSpace, gStyles } from '../styles'
import { v4 as uidGenerator } from 'uuid'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
import FormSelectPrice from './FormSelectPrice'
import { PriceType } from '../types/PriceType'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import FormChooseCategory from './FormChooseCategory'

const FormikSelectCategories = ({
  name,
  label,
  selectPrice,
  startAt //? TODO: <--- Should be add?
}: {
  name: string
  label?: string
  selectPrice?: boolean
  startAt?: Date
}) => {
  const { categories } = useStore()
  const [field, meta, helpers] = useField(name)
  const value = field.value || []

  const [categoryPrices, setCategoryPrices] = useState<Partial<PriceType>[]>([])
  const [price, setPrice] = useState<Partial<PriceType> | null>(null)
  const [category, setCategory] = useState<Partial<CategoryType> | null>(null)

  const items: ItemSelected[] = useMemo(() => value, [value])

  const handleRemoveItem = (id: string) => {
    const newItems = items?.filter((item) => item?.id !== id)
    helpers.setValue(newItems)
  }

  useEffect(() => {
    const catSelectedPrices =
      categories.find(({ id }) => category?.id === id)?.prices || []
    setCategoryPrices(catSelectedPrices)
    setPrice(catSelectedPrices[0])
  }, [category])

  const modal = useModal({ title: 'Agregar Item' })
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          marginTop: gSpace(2)
        }}
      >
        <Text style={{ marginRight: 6 }}>
          Artículos {`(${items?.length || 0})`}
        </Text>
        <Button
          onPress={() => {
            modal.toggleOpen()
          }}
          //label='Item'
          icon="add"
          justIcon
        ></Button>

        <StyledModal {...modal}>
          <View style={{ marginVertical: 8 }}>
            <FormChooseCategory
              categories={categories}
              setValue={(value) => {
                const newItem = categories.find(({ id }) => id === value)
                setCategory(newItem)
              }}
              value={category?.id || ''}
            />
          </View>
          {selectPrice && (
            <View style={{ marginVertical: 8 }}>
              <FormSelectPrice
                prices={categoryPrices}
                setValue={(priceId) => {
                  if (priceId === price?.id) return setPrice(null)
                  setPrice(categoryPrices.find((price) => price.id === priceId))
                }}
                value={price?.id}
              />
            </View>
          )}
          <View style={{ justifyContent: 'center' }}>
            <Button
              onPress={() => {
                const newItem = {
                  id: uidGenerator(),
                  categoryName: category?.name || '',
                  priceSelectedId: price?.id || null,
                  priceSelected: price || null
                }
                helpers.setValue([...items, newItem])
                modal.toggleOpen()
              }}
              label="Agregar"
              icon="add"
              size="small"
              fullWidth={false}
            />
          </View>
        </StyledModal>
      </View>
      <ListItems items={items} handleRemoveItem={handleRemoveItem} />

      <Totals items={items} />
    </>
  )
}

export const Totals = ({ items }: { items: ItemSelected[] }) => {
  const total = items.reduce(
    (acc, item) => acc + (item.priceSelected?.amount || 0),
    0
  )

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

export default FormikSelectCategories
