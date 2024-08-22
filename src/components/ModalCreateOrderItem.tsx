import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from './Button'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { onAssignItem } from '../firebase/actions/item-actions'
import { useOrderDetails } from '../contexts/orderContext'
import OrderType, { order_status, order_type } from '../types/OrderType'
import { useEmployee } from '../contexts/employeeContext'
import ItemType from '../types/ItemType'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import TextInfo from './TextInfo'
import FormItem from './FormItem'
import { ItemSelected } from './FormSelectItem'
import { CategoryType } from '../types/RentItem'
import StoreType from '../types/StoreType'
import { ListAssignedItemsE } from './ListAssignedItems'
import { gStyles } from '../styles'

const ModalCreateOrderItem = ({ itemId }: { itemId: ItemType['id'] }) => {
  const { order } = useOrderDetails()

  const { storeId, categories, storeSections } = useStore()
  const { permissions } = useEmployee()

  const [itemAlreadyExist, setItemAlreadyExist] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [_item, _setItem] = useState<ItemSelected>(undefined)

  const [itemSelected, setItemSelected] = useState<null | string>(null)
  const [progress, setProgress] = useState(0)
  const createModal = useModal({ title: 'Asignar o crear artículo' })

  const orderItemInfo = order.items.find((i) => i.id === itemId)

  const orderId = order?.id
  const isRent = order.type === order_type.RENT
  const isDeliveredRent = order.status === order_status.DELIVERED && isRent

  const canCreateItem =
    order.type === order_type.RENT &&
    order.status === order_status.DELIVERED &&
    permissions?.canCreateItems

  const handleSelectItem = (itemId) => {
    setItemSelected(itemId)
  }

  const { items: employeeItems } = useEmployee()

  useEffect(() => {
    ServiceStoreItems.get({ itemId, storeId }).then((res) => {
      if (res) {
        _setItem(res)
        setItemAlreadyExist(true)
      } else {
        _setItem(orderItemInfo)
        setItemAlreadyExist(false)
      }
    })
  }, [categories])

  const handleCreteOrderItem = async (values: Partial<ItemType>) => {
    setProgress(1)
    //* 1. CREATE ITEM
    const newItem = await ServiceStoreItems.add({
      item: values,
      storeId
    })

      .then(async ({ res, newItem }) => {
        return { ...newItem, id: res?.id }
      })
      .catch((e) => console.log({ e }))
    setProgress(30)
    const itemCreated: Partial<ItemType> = { ...newItem }

    //* 2. UPDATE ORDER WITH THE NEW ITEM

    await ServiceOrders.updateItemId({
      orderId,
      itemId,
      newItemId: itemCreated.id,
      newItemCategoryName: itemCreated?.categoryName,
      newItemNumber: itemCreated.number
    })
      .then((res) => console.log({ res }))
      .catch((e) => console.log({ e }))
    setProgress(80)

    if (itemCreated.id) {
      //* 3. ADD ENTRY TO THE ITEM
      ServiceStoreItems.addEntry({
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
    }
    setProgress(100)
    return
  }
  const handleAssignItem = async () => {
    setLoading(true)
    createModal.toggleOpen()

    await onAssignItem({
      orderId,
      newItemId: itemSelected,
      oldItemId: itemId,
      storeId,
      newItemNumber: employeeItems?.find((i) => i?.id === itemSelected)?.number
    })
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ err }))
    setLoading(false)
    return
  }
  console.log({ progress })
  return (
    <>
      {itemAlreadyExist === false && (
        <Button
          progress={progress}
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
                  item: orderItemInfo,
                  storeSections,
                  storeCategories: categories
                })
              }}
              onSubmit={async (values) => {
                return handleCreteOrderItem(values)
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
    </>
  )
}

export default ModalCreateOrderItem

const styles = StyleSheet.create({})
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
    category: storeCategories?.find((cat) => cat?.name === item?.categoryName)
      ?.id,
    categoryName: item?.categoryName || '',
    brand: item?.brand || order?.itemBrand || '',
    //number:,
    serial: item?.serial || order?.itemSerial || '',
    status: order?.status === order_status.DELIVERED ? 'rented' : 'pickedUp'
  }
}
