import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { useOrderDetails } from '../../contexts/orderContext'
import TextInfo from '../TextInfo'
import { gSpace } from '../../styles'
import { onRentFinish } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import CardItem from '../CardItem'
import InputSignUp from '../InputSignature'
import { onSendOrderWhatsapp } from '../../libs/whatsapp/sendOrderMessage'
import { useStore } from '../../contexts/storeContext'

const ModalRentFinish = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const { user } = useAuth()
  const { store } = useStore()
  const items = order?.items || []
  const handleRentFinish = async () => {
    //*pickup items
    modal.setOpen(false)
    onRentFinish({ order, userId: user.id })
    onSendOrderWhatsapp({
      store,
      order,
      type: 'pickup',
      userId: user.id
    })
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
          {items?.map((item, index) => (
            <CardItem item={item} key={item.id} />
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

export default ModalRentFinish
