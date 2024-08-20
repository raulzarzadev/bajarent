import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RowItem from './RowItem'
import ButtonConfirm from './ButtonConfirm'
import FormItem from './FormItem'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'
import { gSpace, gStyles } from '../styles'
import theme, { colors } from '../theme'
import { useStore } from '../contexts/storeContext'
import { ItemSelected } from './FormSelectItem'
import OrderType, { order_status, order_type } from '../types/OrderType'
import ItemType from '../types/ItemType'
import { useEmployee } from '../contexts/employeeContext'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import TextInfo from './TextInfo'

import ModalChangeItem from './ModalChangeItem'
import StoreType from '../types/StoreType'
import { CategoryType } from '../types/RentItem'
import { ListAssignedItemsE } from './ListAssignedItems'
import { onAssignItem } from '../firebase/actions/item-actions'

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
  const { permissions } = useEmployee()
  const { storeId, categories, storeSections, fetchItems } = useStore()

  const itemId = item.id
  const orderId = order.id

  const [itemData, setItemData] = useState<Partial<ItemType>>()

  const [itemAlreadyExist, setItemAlreadyExist] = useState(false)
  const [_item, _setItem] = useState<ItemSelected>(undefined)

  const canCreateItem =
    order.type === order_type.RENT &&
    order.status === order_status.DELIVERED &&
    permissions?.canCreateItems

  const isRent = order.type === order_type.RENT
  const isDeliveredRent = order.status === order_status.DELIVERED && isRent

  useEffect(() => {
    ServiceStoreItems.get({ itemId, storeId }).then((res) => {
      setItemData(res)
    })
  }, [itemId])

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

  const createModal = useModal({ title: 'Asignar o crear artículo' })
  const [itemSelected, setItemSelected] = useState<null | string>(null)
  const handleSelectItem = (itemId) => {
    setItemSelected(itemId)
  }
  const { items } = useEmployee()
  const [loading, setLoading] = useState(false)

  const handleAssignItem = async () => {
    setLoading(true)
    createModal.toggleOpen()

    await onAssignItem({
      orderId,
      newItemId: itemSelected,
      oldItemId: itemId,
      storeId,
      newItemNumber: items?.find((i) => i?.id === itemSelected)?.number
    })
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ err }))
    setLoading(false)
    return
  }
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ModalChangeItem itemId={itemId} orderId={orderId} disabled={loading} />

        <RowItem
          item={{
            ...item,
            ...itemData
          }}
          style={{
            marginVertical: gSpace(2),
            marginHorizontal: gSpace(2),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.info,
            paddingHorizontal: gSpace(2),
            paddingVertical: gSpace(1),
            borderRadius: gSpace(2)
          }}
        />

        {!itemAlreadyExist && (
          <Button
            justIcon
            size="small"
            icon="add"
            color="success"
            variant="ghost"
            onPress={() => {
              createModal.toggleOpen()
            }}
            disabled={loading}
          />
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
            confirmDisabled={loading}
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
            disabled={loading}
          />
        )}
      </View>

      <StyledModal {...createModal}>
        {!canCreateItem && (
          <TextInfo
            defaultVisible
            type="warning"
            text={`Para crear este artículo la orden  debe 
               ${!isRent ? 'ser RENTA ⏳. ' : ''} 
               ${!isDeliveredRent ? 'estar ENTREGADA 🏠. ' : ''}  
               ${!canCreateItem ? 'tener PERMISOS' : ''}`}
          />
        )}

        {canCreateItem && (
          <>
            <Text style={gStyles.h2}>Crea un artítculo nuevo</Text>

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
                const newItem = await ServiceStoreItems.add({
                  item: values,
                  storeId
                })
                  .then(async ({ res, newItem }) => {
                    return { ...newItem, id: res.id }
                  })
                  .catch((e) => console.log({ e }))

                //@ts-ignore
                const itemCreated: ItemType = { ...newItem }

                fetchItems()
                if (itemCreated.id) {
                  //* ADD ENTRY TO THE ITEM
                  await ServiceStoreItems.addEntry({
                    storeId,
                    itemId: itemCreated.id,
                    entry: {
                      type: 'created',
                      content: 'Item creado y entregado',
                      orderId: orderId || '',
                      itemId
                    }
                  })
                    .then((res) => console.log({ res }))
                    .catch((e) => console.log({ e }))

                  //* UPDATE ORDER WITH THE NEW ITEM
                  await ServiceOrders.updateItemId({
                    orderId,
                    itemId,
                    newItemId: itemCreated.id,
                    newItemCategoryName: itemCreated?.categoryName,
                    newItemNumber: itemCreated.number
                  })
                    .then((res) => console.log({ res }))
                    .catch((e) => console.log({ e }))
                  onAction?.('created', { id: itemCreated.id })

                  return
                }
              }}
            />
            <Text style={[gStyles.h2, { marginTop: 16 }]}>o</Text>
            <Text style={[gStyles.h2, { marginBottom: 16 }]}>
              Asigna alguno
            </Text>
            <ListAssignedItemsE
              itemSelected={itemSelected}
              onSelectItem={(itemId) => {
                handleSelectItem(itemId)
              }}
            />
            <Button
              disabled={!itemSelected}
              label="Asignar item"
              onPress={() => {
                handleAssignItem()
              }}
            ></Button>
          </>
        )}
      </StyledModal>
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
