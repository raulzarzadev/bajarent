import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { onComment, onRepairFinish } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'

const ModalRepairFinish = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const storeId = order?.storeId

  const { user } = useAuth()

  const handleStartRepair = async () => {
    //*pickup items
    modal.setOpen(false)

    await onRepairFinish({
      orderId: order.id,
      userId: user.id
    })

    //* create movement
    await onComment({
      orderId: order.id,
      content: 'Reparación terminada',
      storeId,
      type: 'comment'
    })
  }

  const item = order.item

  return (
    <View>
      <StyledModal {...modal}>
        <Button
          label="Reparación terminada 🔧"
          onPress={() => {
            handleStartRepair()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalRepairFinish
