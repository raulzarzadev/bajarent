import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { useOrderDetails } from '../../contexts/orderContext'
import TextInfo from '../TextInfo'
import ItemOrderDetails from '../ItemOrderDetails'
import { gSpace } from '../../styles'
import { onRentFinish } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'

const ModalRentFinish = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const { user } = useAuth()
  const items = order?.items
  const handleRentFinish = async () => {
    //*pickup items
    //onPickUp order it's ok
    modal.setOpen(false)
    onRentFinish({ order, userId: user.id })
  }

  return (
    <View>
      <StyledModal {...modal}>
        <View>
          <TextInfo
            defaultVisible
            text="Asegurate de que RECOGES el siguiente artículo"
          />
        </View>
        <View style={{ marginVertical: gSpace(3) }}>
          {items.map((item, index) => (
            <ItemRentOrder key={index} item={item} />
          ))}
        </View>
        <Button
          label="Recoger"
          onPress={() => {
            handleRentFinish()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}
export const ItemRentOrder = ({ item }) => {
  return (
    <View>
      <ItemOrderDetails item={item} />
    </View>
  )
}

export default ModalRentFinish
