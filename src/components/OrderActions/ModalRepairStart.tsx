import { View } from 'react-native'
import React, { useState } from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { onComment, onRepairStart } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import FormRepairDelivery from './FormRepairDelivery'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { RepairItemConfigInfo } from '../OrderDetails'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'

const ModalStartRepair = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const storeId = order?.storeId
  // const items = order?.items

  const { user } = useAuth()
  const { addWork } = useCurrentWork()
  const handleStartRepair = async () => {
    //*pickup items
    modal.setOpen(false)

    await onRepairStart({
      orderId: order.id,
      userId: user.id,
      storeId
    })
    addWork({
      work: {
        action: 'repair_start',
        type: 'order',
        details: {
          orderId: order.id,
          sectionId: order?.sectionId || null
        }
      }
    })
  }

  const [dirty, setDirty] = useState(false)

  return (
    <View>
      <StyledModal {...modal}>
        <View style={{ marginBottom: 8 }}>
          <RepairItemConfigInfo />
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
