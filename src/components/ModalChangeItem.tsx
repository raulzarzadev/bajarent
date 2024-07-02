import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { ListAssignedItemsE } from './ListAssignedItems'
import { useStore } from '../contexts/storeContext'
import { onChangeOrderItem } from '../firebase/actions/item-actions'

const ModalChangeItem = ({ itemId, orderId }) => {
  const { storeId } = useStore()
  const [itemSelected, setItemSelected] = useState(undefined)
  const handleChangeItem = async () => {
    //  console.log('Changing item', { itemId, newItemId: itemSelected, orderId })
    onChangeOrderItem({ itemId, orderId, newItemId: itemSelected, storeId })
  }

  return (
    <View>
      <ButtonConfirm
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
          <ListAssignedItemsE
            onPressItem={(e) => {
              console.log({ e })
              setItemSelected(e)
            }}
            itemSelected={itemSelected}
          />
        </View>
      </ButtonConfirm>
    </View>
  )
}

export default ModalChangeItem
