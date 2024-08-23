import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { ListAssignedItemsE } from './ListAssignedItems'
import { useStore } from '../contexts/storeContext'
import { onChangeOrderItem } from '../firebase/actions/item-actions'
import TextInfo from './TextInfo'
import { ListItemsSectionsE } from './ListItemsSections'
import { useEmployee } from '../contexts/employeeContext'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useOrderDetails } from '../contexts/orderContext'
import { order_status, order_type } from '../types/OrderType'

const ModalChangeItem = ({
  itemId,
  orderId,
  disabled
}: {
  itemId: string
  orderId: string
  disabled?: boolean
}) => {
  const { storeId, categories } = useStore()
  const { permissions } = useEmployee()
  const viewAllItems = permissions.isAdmin || permissions.isOwner
  const [itemSelected, setItemSelected] = useState(undefined)

  const handleChangeItem = async () => {
    const newItem = await ServiceStoreItems.get({
      storeId,
      itemId: itemSelected
    })
    newItem.categoryName = categories.find(
      (e) => e.id === newItem?.category
    )?.name
    onChangeOrderItem({
      itemId,
      orderId,
      storeId,
      newItem,
      currentSectionId: order.assignToSection
    })
  }

  const { order } = useOrderDetails()
  //* if is rent and not delivered return null
  if (order.type === order_type.RENT && order.status !== order_status.DELIVERED)
    return null
  return (
    <View>
      <ButtonConfirm
        openDisabled={disabled}
        handleConfirm={async () => {
          handleChangeItem()
        }}
        confirmLabel="Cambiar"
        confirmVariant="outline"
        openSize="small"
        openColor="info"
        icon="swap"
        justIcon
        modalTitle="Cambiar artículo"
      >
        <View>
          <TextInfo
            type="warning"
            text="Sí el artículo que recojes NO existe, NO se creara uno nuevo. Asegurate de crearlo antes de cambiarlo sí es necesario"
            defaultVisible
          />
          {viewAllItems ? (
            <ListItemsSectionsE
              onPressItem={(e) => {
                setItemSelected(e)
              }}
              itemSelected={itemSelected}
            />
          ) : (
            <ListAssignedItemsE
              onPressItem={(e) => {
                setItemSelected(e)
              }}
              itemSelected={itemSelected}
            />
          )}
        </View>
      </ButtonConfirm>
    </View>
  )
}

export default ModalChangeItem
