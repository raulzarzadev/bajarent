import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import {
  onComment,
  onRepairDelivery,
  onRepairFinish
} from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import { Formik } from 'formik'
import FormRepairDelivery from '../FormRepairDelivery'
import { ServiceOrders } from '../../firebase/ServiceOrders'

const ModalRepairDelivery = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()

  const { user } = useAuth()

  const handleStartRepair = async () => {
    //*pickup items
    modal.setOpen(false)

    await onRepairDelivery({
      orderId: order.id,
      userId: user.id
    })
      .then((res) => console.log({ res }))
      .catch(console.error)
    await onComment({
      content: 'Reparación entregada',
      orderId: order.id,
      storeId: order.storeId,
      type: 'comment'
    })
    return
  }

  const item = order.item

  return (
    <View>
      <StyledModal {...modal}>
        <FormRepairDelivery
          initialValues={{
            address: order.address || '',
            location: order.location || '',
            references: order.references || ''
          }}
          onSubmit={async (values) => {
            await ServiceOrders.update(order.id, values).catch(console.error)
            return
          }}
        />
        <Button
          label="Entregar reparación "
          onPress={() => {
            handleStartRepair()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalRepairDelivery
