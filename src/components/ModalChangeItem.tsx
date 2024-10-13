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
import { gStyles } from '../styles'

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

  const itemRow = order?.items?.find((e) => e?.id === itemId)

  const itemExist = !(itemRow.number === 'SN')

  return (
    <View>
      <ButtonConfirm
        openDisabled={disabled}
        handleConfirm={async () => {
          handleChangeItem()
        }}
        confirmLabel="Cambiar"
        confirmVariant="filled"
        confirmColor="primary"
        confirmDisabled={!itemSelected}
        confirmDisabledHelper="Selecciona un artículo"
        openSize="small"
        openColor="info"
        icon="swap"
        justIcon
        modalTitle="Cambiar artículo"
        cancelButton
        handleCancel={() => {
          setItemSelected(undefined)
        }}
      >
        {!itemExist && (
          <>
            <TextInfo
              defaultVisible={true}
              type="error"
              text="Artículo no existe"
            ></TextInfo>
            <Text style={[gStyles.h3, { marginVertical: 8 }]}>
              Crea un artículo para poder cambiarlo.
            </Text>
          </>
        )}
        {itemExist && (
          <View>
            {/* <TextInfo
              type="warning"
              text="Sí el artículo que recojes NO existe, NO se creara uno nuevo. Asegurate de crearlo antes de cambiarlo sí es necesario"
              defaultVisible={true}
            /> */}
            {viewAllItems ? (
              <ListItemsSectionsE
                // onPressItem={(e) => {
                //   setItemSelected(e)
                // }}
                itemSelected={itemSelected}
                selectOnPress={setItemSelected}
              />
            ) : (
              <ListAssignedItemsE
                // onPressItem={(e) => {
                //   setItemSelected(e)
                // }}
                itemSelected={itemSelected}
                selectOnPress={setItemSelected}
              />
            )}
          </View>
        )}
      </ButtonConfirm>
    </View>
  )
}

export default ModalChangeItem
