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
import { ServiceStores, nextItemNumber } from '../firebase/ServiceStore'

import ModalChangeItem from './ModalChangeItem'
import StoreType from '../types/StoreType'
import { CategoryType } from '../types/RentItem'

export const RowOrderItem = ({
  item,
  onPressDelete,
  onEdit,
  order,
  onAction
}: {
  order: Partial<OrderType>
  item: ItemSelected
  onPressDelete?: () => void
  onEdit?: (values: ItemSelected) => void | Promise<void>
  onAction?: (
    action: 'edit' | 'delete' | 'created',
    ops?: { id: string }
  ) => void
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

  const isRent = order.type === order_type.RENT
  const isDeliveredRent = order.status === order_status.DELIVERED && isRent
  const hasPermissionsToCreateItem = permissions.canManageItems

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
            text={`Para crear este artículo la orden  debe  ${
              !isRent && 'ser una renta ⏳. '
            } ${!isDeliveredRent && 'estar entregada 🏠. '},   ${
              !hasPermissionsToCreateItem && 'tener permisos necesarios'
            }`}
          />
        )}

        {canCreateItem && (
          <FormItem
            values={{
              ...formatNewItem({
                order,
                item,
                storeSections,
                storeCategories: categories
              })
            }}
            onSubmit={async (values) => {
              //* CREATE ITEM
              const newItemId = await ServiceStoreItems.add({
                item: values,
                storeId
              })
                .then(async ({ res }) => {
                  const newItemId = res.id
                  return newItemId
                })
                .catch((e) => console.log({ e }))

              if (newItemId) {
                //* ADD ENTRY TO THE ITEM
                await ServiceStoreItems.addEntry({
                  storeId,
                  itemId: newItemId,
                  entry: {
                    type: 'created',
                    content: 'Item creado',
                    orderId: orderId || ''
                  }
                })
                  .then((res) => console.log({ res }))
                  .catch((e) => console.log({ e }))

                //* UPDATE ORDER WITH THE NEW ITEM
                await ServiceOrders.updateItemId({
                  orderId,
                  itemId,
                  newItemId: newItemId
                })
                  .then((res) => console.log({ res }))
                  .catch((e) => console.log({ e }))
                onAction?.('created', { id: newItemId })

                return
              }
            }}
          />
        )}
      </StyledModal>

      <Pressable
        onPress={async () => {
          if (itemAlreadyExist) {
            toItems({ id: itemId })
          } else {
            createModal.toggleOpen()
            console.log('this items not exist', { itemId })
          }
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!!itemAlreadyExist && (
          <ModalChangeItem itemId={itemId} orderId={orderId} />
        )}
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

const formatNewItem = ({
  order,
  item,
  storeSections,
  storeCategories
}: {
  order: Partial<OrderType>
  item: ItemSelected
  storeSections: StoreType['sections']
  storeCategories: Partial<CategoryType>[]
}): Partial<ItemType> => {
  const sectionAssigned = storeSections.find(
    (s) => s.id === order.assignToSection
  )
  // const createEcoNumber = async ({ storeId }) => {
  //   const currentNumber = await ServiceStores.currentItemNumber(storeId)
  //   const nexItemNumber = nextItemNumber({ currentNumber })
  //   return nexItemNumber
  // }
  // const number = await createEcoNumber({ storeId: order?.storeId })
  return {
    assignedSection: sectionAssigned?.id || '',
    assignedSectionName: sectionAssigned?.name || '',
    category: storeCategories.find((cat) => cat.name === item.categoryName)?.id,
    categoryName: item?.categoryName || '',
    brand: item?.brand || order?.itemBrand || '',
    //number:,
    serial: item?.serial || order?.itemSerial || '',
    status: order?.status === order_status.DELIVERED ? 'rented' : 'pickedUp'
  }
}

export default RowOrderItem
