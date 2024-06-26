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
import Totals from './ItemsTotals'
import { useEmployee } from '../contexts/employeeContext'
import { ListAssignedItemsE } from './ListAssignedItems'
import ItemType from '../types/ItemType'
import RowItem from './RowItem'

const FormikSelectCategories = ({
  name,
  label,
  selectPrice,
  startAt //? TODO: <--- Should be add?
}: //choseEmptyCategory = true //*<--- this will alow you choose category with out specific item
{
  name: string
  label?: string
  selectPrice?: boolean
  startAt?: Date
  choseEmptyCategory?: boolean
}) => {
  const { categories } = useStore()
  const { items: employeeItems } = useEmployee()

  const [availableCategories, setAvailableCategories] = useState<
    Partial<CategoryType>[]
  >([])

  useEffect(() => {
    setAvailableCategories(
      categories.filter((category) =>
        employeeItems.find((item) => item.category === category?.id)
      )
    )
  }, [employeeItems])

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
    // setPrice(catSelectedPrices[0])
  }, [category])

  const [itemSelected, setItemSelected] = useState<ItemType['id']>()

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
              categories={availableCategories}
              setValue={(value) => {
                const newItem = categories.find(({ id }) => id === value)
                setItemSelected('')
                setCategory(newItem)
              }}
              value={category?.id || ''}
            />
          </View>

          <View>
            <ListAssignedItemsE
              categoryId={category?.id}
              itemSelected={itemSelected}
              onPressItem={(id) => {
                if (itemSelected === id) {
                  setItemSelected('')
                } else {
                  setItemSelected(id)
                }
                const itemCategory = employeeItems.find(
                  (item) => item.id === id
                ).category
                setCategory(categories.find((cat) => cat.id === itemCategory))
              }}
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
                const itemData = employeeItems.find(
                  (item) => item.id === itemSelected
                )
                const newItem = {
                  id: itemSelected || uidGenerator(), //* <--- if category is empty, then the itemSelected will be the id
                  itemId: itemSelected || '',
                  categoryName: category?.name || '',
                  serial: itemData?.serial || '',
                  priceSelectedId: price?.id || null,
                  priceSelected: price || null,
                  number: itemData?.number || 'SN'
                }
                console.log({ newItem })
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
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <RowItem
        item={item}
        style={{
          marginVertical: gSpace(2),
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.info,
          paddingHorizontal: gSpace(2),
          paddingVertical: gSpace(1),
          borderRadius: gSpace(2),
          marginRight: gSpace(2)
        }}
      />
      {/* <View
        style={{
          // width: '100%',
          flex: 1,
          marginVertical: gSpace(2),
          justifyContent: 'space-between',
          flexDirection: 'row',
          //maxWidth: 320,
          marginHorizontal: 'auto',
          alignItems: 'center',
          backgroundColor: theme.info,
          paddingHorizontal: gSpace(2),
          paddingVertical: gSpace(1),
          borderRadius: gSpace(2),
          marginRight: gSpace(2)
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>{item?.number || 'SN'}</Text>
        <Text style={{ fontWeight: 'bold' }}>{item?.categoryName}</Text>
        <Text style={{ alignItems: 'center' }}>
          {item.priceSelected?.title}
        </Text>
        <CurrencyAmount
          style={{ fontWeight: 'bold' }}
          amount={item.priceSelected?.amount}
        />
      </View> */}
      <Button
        icon="sub"
        color="error"
        justIcon
        onPress={onPressDelete}
        size="small"
      />
    </View>
  )
}

export default FormikSelectCategories
