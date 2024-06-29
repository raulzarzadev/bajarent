import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RowItem from './RowItem'
import ButtonConfirm from './ButtonConfirm'
import FormItem from './FormItem'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'
import { gSpace } from '../styles'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
import { ItemSelected } from './FormSelectItem'
import OrderType, { order_status, order_type } from '../types/OrderType'
import ItemType from '../types/ItemType'
import { useEmployee } from '../contexts/employeeContext'

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
  const { storeId, categories } = useStore()
  const { permissions } = useEmployee()

  const priceSelected = item.priceSelected
  const itemId = item.id
  const orderId = order.id

  const [shouldCreateItem, setShouldCreateItem] = useState(false)

  const [_item, _setItem] = useState<ItemSelected>(undefined)
  const createItem =
    order.type === order_type.RENT &&
    order.status === order_status.DELIVERED &&
    permissions.canManageItems
  useEffect(() => {
    if (categories)
      ServiceStoreItems.get({ itemId: itemId, storeId })
        .then((res) => {
          _setItem(res)
        })
        .catch((e) => {
          console.log({ e })
          setShouldCreateItem(true)
          const category =
            categories?.find((cat) => cat?.name === item?.categoryName)?.id ||
            ''
          const assignedSection = order?.assignToSection || ''
          const serial = item?.serial || order?.itemSerial || ''
          const number = item?.number || ''
          const brand = item?.brand || order?.itemBrand || ''
          const status: ItemType['status'] =
            order.status === order_status.DELIVERED ? 'rented' : 'pickedUp'

          const newItem = {
            status,
            assignedSection,
            category,
            categoryName: item.categoryName || '',
            brand,
            number,
            serial
          }
          console.log({ newItem })
          _setItem({ ...newItem })
        })
  }, [itemId, categories])

  console.log({ item, _item })

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <RowItem
        item={{
          ..._item,
          priceSelected
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

export default RowOrderItem
