import React, { useEffect, useMemo, useState } from 'react'
import { useField } from 'formik'
import { ItemSelected } from './FormSelectItem'
import { CategoryType } from '../types/RentItem'
import Button from './Button'
import { FlatList, Text, View } from 'react-native'
import { gSpace } from '../styles'
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
import ButtonConfirm from './ButtonConfirm'
import FormItem from './FormItem'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ModalSelectCategoryPriceE } from './ModalSelectCategoryPrice'
import { ErrorsList } from './FormikErrorsList'

const FormikSelectCategories = ({
  name,
  selectPrice,
  startAt //? TODO: <--- Should be add?
}: //choseEmptyCategory = true //*<--- this will alow you choose category with out specific item
{
  name: string
  label?: string
  selectPrice?: boolean
  startAt?: Date
}) => {
  const { categories } = useStore()
  const {
    items: employeeItems,
    permissions: { shouldChooseExactItem }
  } = useEmployee()
  const [field, meta, helpers] = useField(name)
  const ALLOW_CHOOSE_EMPTY_CATEGORY = !shouldChooseExactItem

  const [availableCategories, setAvailableCategories] = useState<
    Partial<CategoryType>[]
  >([])

  const shouldSelectAnItem = !ALLOW_CHOOSE_EMPTY_CATEGORY
  useEffect(() => {
    setAvailableCategories(categories)
  }, [employeeItems])

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

  const modal = useModal({ title: 'Agregar artículo' })
  const handleChangeItemSelected = (items: ItemSelected[]) => {
    helpers.setValue(items)
  }
  const handleChangeItemPrice = (itemId: string, price: Partial<PriceType>) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          priceSelected: price,
          priceSelectedId: price?.id || null
        }
      }
      return item
    })
    helpers.setValue(newItems)
  }

  const disabledAddItem = !price || (shouldSelectAnItem && !itemSelected)
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
                setPrice(null)
                setCategory(newItem)
              }}
              value={category?.id || ''}
            />
          </View>

          <View>
            <ListAssignedItemsE
              categoryId={category?.id}
              itemSelected={itemSelected}
              onSelectItem={(id) => {
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
          {!!selectPrice && (
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

          <ErrorsList
            errors={(() => {
              let errorList: Record<string, string> = {}
              if (!itemSelected && shouldSelectAnItem)
                errorList.itemSelected = 'Seleccione un artículo'
              if (!price) errorList.priceSelected = 'Seleccione un precio'
              return errorList
            })()}
          />

          <View style={{ justifyContent: 'center' }}>
            <Button
              buttonStyles={{ margin: 'auto', marginTop: gSpace(2) }}
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
                //console.log({ newItem })
                handleChangeItemSelected([...items, newItem])
                modal.toggleOpen()
              }}
              disabled={disabledAddItem}
              label="Agregar"
              icon="add"
              fullWidth
            />
          </View>
        </StyledModal>
      </View>
      <ListItems
        items={items}
        handleRemoveItem={handleRemoveItem}
        handleChangeItemPrice={handleChangeItemPrice}
      />
      <Totals items={items} />
    </>
  )
}

const ListItems = ({
  items,
  handleRemoveItem,
  handleChangeItemPrice
}: {
  items: ItemSelected[]
  handleRemoveItem: (itemId: string) => void
  handleChangeItemPrice?: (itemId: string, price: Partial<PriceType>) => void
}) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item, index }) => (
        <ItemRow
          item={item as ItemType}
          onPressDelete={() => handleRemoveItem(item.id)}
          handleChangeItemPrice={(price) => {
            handleChangeItemPrice?.(item?.id, price)
          }}
        ></ItemRow>
      )}
      keyExtractor={(item) => item?.id}
    ></FlatList>
  )
}

export const ItemRow = ({
  item,
  onPressDelete,
  onEdit,
  createItem,
  orderId,
  handleChangeItemPrice
}: {
  item: ItemType
  onPressDelete?: () => void
  onEdit?: (values: ItemSelected) => void | Promise<void>
  createItem?: boolean
  orderId?: string
  handleChangeItemPrice?: (price: Partial<PriceType>) => void
}) => {
  const { storeId, categories } = useStore()
  const [shouldCreateItem, setShouldCreateItem] = useState(false)
  const [_item, _setItem] = useState<Partial<ItemType>>(item)
  useEffect(() => {
    ServiceStoreItems.get({ itemId: item?.id, storeId })
      .then((res) => {
        _setItem(res)
      })
      .catch((e) => {
        console.log({ e })
        setShouldCreateItem(true)
        _setItem({ ...item })
      })
  }, [item.id])
  const assignedSection = _item?.assignedSection || ''
  const category = _item?.category || ''
  const brand = _item?.brand || ''
  const number = _item?.number || ''
  const serial = _item?.serial || ''

  const itemCategoryId = categories?.find(
    (cat) => item?.category === cat?.id || item.categoryName === cat?.name
  )?.id

  //@ts-ignore //TODO: <--- this should be fixed
  const priceSelectedId = item?.priceSelected?.id
  //const priceSelectedId = item?.priceSelectedId
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View style={{ marginRight: 6 }}>
        <ModalSelectCategoryPriceE
          categoryId={itemCategoryId}
          handleSelectPrice={(res) => {
            handleChangeItemPrice(res)
          }}
          priceSelectedId={priceSelectedId}
        />
      </View>
      <RowItem
        item={{ ...item, ..._item }}
        style={{
          marginVertical: gSpace(2),
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.info,
          paddingHorizontal: gSpace(2),
          paddingVertical: gSpace(1),
          borderRadius: gSpace(2)
        }}
      />
      {shouldCreateItem && createItem && (
        <ButtonConfirm
          handleConfirm={async () => {}}
          confirmLabel="Cerrar"
          confirmVariant="filled"
          openSize="small"
          openColor="success"
          icon="save"
          justIcon
          modalTitle="Crear item"
        >
          <View style={{ marginBottom: 8 }}>
            <FormItem
              values={{
                assignedSection,
                brand,
                category,
                number,
                serial
              }}
              onSubmit={async (values) => {
                //* create item
                const res = await ServiceStoreItems.add({
                  item: values,
                  storeId
                }).then(({ res, newItem }) => {
                  if (res.id) {
                    ServiceOrders.updateItemId({
                      orderId: orderId,
                      itemId: item.id,
                      newItemId: res.id,
                      newItemCategoryName: categories.find(
                        (cat) => cat.id === item.category
                      )?.name,
                      newItemNumber: res?.number
                    })
                    //* update Order
                  }
                })
              }}
            />
          </View>
        </ButtonConfirm>
      )}

      {!!onEdit && (
        <ButtonConfirm
          handleConfirm={async () => {}}
          confirmLabel="Cerrar"
          confirmVariant="outline"
          openSize="small"
          openColor="info"
          icon="edit"
          justIcon
          modalTitle="Editar item"
        >
          <View style={{ marginBottom: 8 }}>
            <FormItem
              values={_item}
              onSubmit={async (values) => {
                return await onEdit(values)
              }}
            />
          </View>
        </ButtonConfirm>
      )}

      {!!onPressDelete && (
        <Button
          buttonStyles={{ marginLeft: gSpace(2) }}
          icon="sub"
          color="error"
          justIcon
          onPress={onPressDelete}
          size="small"
        />
      )}
    </View>
  )
}

export default FormikSelectCategories
