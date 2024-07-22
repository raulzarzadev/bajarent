import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import TextInfo from '../TextInfo'
import { onComment, onRepairStart } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import { RepairItemDetails } from '../ModalRepairItem'

const ModalStartRepair = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const storeId = order?.storeId
  // const items = order?.items

  const { user } = useAuth()

  const handleStartRepair = async () => {
    //*pickup items
    modal.setOpen(false)

    await onRepairStart({
      orderId: order.id,
      userId: user.id
    })

    //* create movement
    await onComment({
      orderId: order.id,
      content: 'Reparación comenzada',
      storeId,
      type: 'comment'
    })
  }

  const item = order.item

  return (
    <View>
      <StyledModal {...modal}>
        <TextInfo
          text="Asegurate de que REPARAS el siguiente articulo:"
          defaultVisible
        />
        <View style={{ marginBottom: 8 }}>
          <RepairItemDetails item={item} />
        </View>

        <Button
          label="Iniciar 🔧"
          onPress={() => {
            handleStartRepair()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalStartRepair
