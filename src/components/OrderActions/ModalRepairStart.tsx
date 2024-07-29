import { View } from 'react-native'
import React, { useState } from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import TextInfo from '../TextInfo'
import { onComment, onRepairStart } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import { RepairItemDetails } from '../ModalRepairItem'
import FormRepairDelivery from './FormRepairDelivery'
import { ServiceOrders } from '../../firebase/ServiceOrders'

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

  const [dirty, setDirty] = useState(false)

  return (
    <View>
      <StyledModal {...modal}>
        {/* <TextInfo
          text="Asegurate de que REPARAS el siguiente articulo:"
          defaultVisible
        /> */}
        <View style={{ marginBottom: 8 }}>
          <FormRepairDelivery
            initialValues={{
              address: order.address || '',
              location: order.location || '',
              references: order.references || ''
            }}
            setDirty={setDirty}
            onSubmit={async (values) => {
              console.log({ values })
              await ServiceOrders.update(order.id, values).catch(console.error)
              return
            }}
          />
        </View>

        <Button
          disabled={dirty}
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
