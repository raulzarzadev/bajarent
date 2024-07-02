import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RowItem from './RowItem'
import ButtonConfirm from './ButtonConfirm'
import FormItem from './FormItem'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'
import { gSpace } from '../styles'
import theme, { colors } from '../theme'
import { useStore } from '../contexts/storeContext'
import { ItemSelected } from './FormSelectItem'
import OrderType, { order_status, order_type } from '../types/OrderType'
import ItemType from '../types/ItemType'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Icon from './Icon'
import TextInfo from './TextInfo'
import { ServiceStores, sumHexDec } from '../firebase/ServiceStore'

export const RowOrderItem = ({
  item,
  onPressDelete,
  onEdit,
  order
}: {
  order: Partial<OrderType>
  item: ItemSelected
  onPressDelete?: () => void
  onEdit?: (values: ItemSelected) => void | Promise<void>
}) => {
  const { storeId, categories, storeSections } = useStore()
  const { permissions } = useEmployee()
  const { toItems } = useMyNav()
  const priceSelected = item.priceSelected
  const itemId = item.id
  const orderId = order.id

  const [itemAlreadyExist, setItemAlreadyExist] = useState(false)
  const [_item, _setItem] = useState<ItemSelected>(undefined)
  const canCreateItem =
    order.type === order_type.RENT &&
    order.status === order_status.DELIVERED &&
    permissions.canManageItems

  useEffect(() => {
    ServiceStoreItems.get({ itemId, storeId }).then((res) => {
      if (res) {
        _setItem(res)
        setItemAlreadyExist(true)
      } else {
        _setItem(item)
        setItemAlreadyExist(false)
      }
    })
  }, [categories])
  const createModal = useModal({ title: 'Crear artículo' })
  return (
    <View>
      <StyledModal {...createModal}>
        {!canCreateItem && (
          <TextInfo
            defaultVisible
            type="warning"
            text="Para crear este artículo la orden  debe ser una renta  ⏳ y estar entregado 🏠 "
          />
        )}
        {canCreateItem && (
          <FormItem
            values={_item}
            onSubmit={async (values) => {
              //* CREATE ITEM

              ServiceStoreItems.add({
                item: values,
                storeId
              })
                .then(({ res }) => {
                  ServiceStoreItems.addEntry({
                    storeId,
                    itemId: res.id,
                    entry: {
                      type: 'created',
                      content: 'Item creado',
                      orderId: orderId || ''
                    }
                  })
                    .then((res) => console.log({ res }))
                    .catch((e) => console.log({ e }))
                  if (res.id) {
                    //* UPDATE ORDER WITH THE NEW ITEM
                    ServiceOrders.updateItemId({
                      orderId,
                      itemId,
                      newItemId: res.id
                    })
                  }
                  console.log({ res })
                })
                .catch(console.error)
            }}
          />
        )}
      </StyledModal>
      <Pressable
        onPress={async () => {
          if (itemAlreadyExist) {
            toItems({ id: itemId })
          } else {
            console.log('this items not exist', { itemId })

            const newItem = await formatNewItem({
              order,
              item,
              storeSections,
              storeCategories: categories
            })
            console.log({ newItem })
            _setItem(newItem)
            createModal.toggleOpen()
          }
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <RowItem
          item={{
            ..._item,
            priceSelected,
            categoryName: item.categoryName
          }}
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
        {/* {shouldcanCreateItem && canCreateItem && (
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
              values={_item}
              onSubmit={async (values) => {
                //* create item
                const res = await ServiceStoreItems.add({
                  item: values,
                  storeId
                }).then(({ res }) => {
                  if (res.id) {
                    ServiceOrders.updateItemId({
                      orderId,
                      itemId,
                      newItemId: res.id
                    })
                    //* update Order
                  }
                  console.log({ res })
                })
              }}
            />
          </View>
        </ButtonConfirm>
      )} */}
        {!!itemAlreadyExist ? (
          <Icon icon="done" color={colors.blue} />
        ) : (
          <Icon icon="add" color={colors.green} />
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
      </Pressable>
    </View>
  )
}

const formatNewItem = async ({
  order,
  item,
  storeSections,
  storeCategories
}): Promise<Partial<ItemType>> => {
  const sectionAssigned = storeSections.find(
    (s) => s.id === order.assignToSection
  )
  const createEcoNumber = async ({ section, brand, lastNumber }) => {
    const currentNumber = await ServiceStores.currentItemNumber(order.storeId)
    const nexItemNumber = sumHexDec({ hex: currentNumber || '0000', dec: 1 })
    console.log({ currentNumber, nexItemNumber })
    return nexItemNumber
    let firstLetter = '' //* BRAND OF THE ITEM
    let secondLetter = '' //* SECTION OF THE ITEM
    let thirdLetter = '' //* INC NUMBER

    const string = storeSections.find((s) => s?.id === section)?.name || 'S'
    const chunks = string.split(' ')
    firstLetter = brand?.[0] || 'S'
    secondLetter = chunks.map((chunk) => chunk[0]).join('')
    thirdLetter = lastNumber.toString(16).toUpperCase()
    return `${firstLetter}${secondLetter}${thirdLetter}`.toUpperCase()
  }
  const number = await createEcoNumber({
    section: sectionAssigned?.id,
    brand: item?.brand,
    lastNumber: 0
  })
  return {
    assignedSection: sectionAssigned?.id || '',
    assignedSectionName: sectionAssigned?.name || '',
    category: storeCategories.find((cat) => cat.name === item.categoryName)?.id,
    categoryName: item?.categoryName || '',
    brand: item?.brand || order?.itemBrand || '',
    number,
    serial: item?.serial || order?.itemSerial || '',
    status: order?.status === order_status.DELIVERED ? 'rented' : 'pickedUp'
  }
}

export default RowOrderItem
