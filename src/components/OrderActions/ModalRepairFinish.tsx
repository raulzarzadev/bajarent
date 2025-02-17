import { View } from 'react-native'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { onRepairFinish } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'

const ModalRepairFinish = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()

  const { user, storeId } = useAuth()

  const handleStartRepair = async () => {
    //*pickup items
    modal.setOpen(false)

    await onRepairFinish({
      orderId: order.id,
      userId: user.id,
      storeId: storeId
    })
  }

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
