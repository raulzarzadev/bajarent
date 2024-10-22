import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { onRepairDelivery } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'

const ModalRepairDelivery = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()

  const { user, storeId } = useAuth()

  const handleRepairDelivery = async () => {
    //*pickup items
    modal.setOpen(false)

    await onRepairDelivery({
      orderId: order.id,
      userId: user.id,
      storeId
    })

    return
  }

  return (
    <View>
      <StyledModal {...modal}>
        {/* <FormRepairDelivery
          initialValues={{
            address: order.address || '',
            location: order.location || '',
            references: order.references || ''
          }}
          onSubmit={async (values) => {
            await ServiceOrders.update(order.id, values).catch(console.error)
            return
          }}
        /> */}
        <Button
          label="Entregar reparación "
          onPress={() => {
            handleRepairDelivery()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalRepairDelivery
