import { View, Text } from 'react-native'
import React, { useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { ListAssignedItemsE } from './ListAssignedItems'
import { useStore } from '../contexts/storeContext'
import { onChangeOrderItem } from '../firebase/actions/item-actions'
import TextInfo from './TextInfo'

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
          <TextInfo
            type="warning"
            text="Sí el artículo que recojes NO existe, NO se creara uno nuevo. Asegurate de crearlo antes de cambiarlo sí es necesario"
            defaultVisible
          />
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
