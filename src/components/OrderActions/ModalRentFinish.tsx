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
import { onSendOrderWhatsapp } from '../../libs/whatsapp/sendOrderMessage'
import { useStore } from '../../contexts/storeContext'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'
import { useCustomers } from '../../state/features/costumers/costumersSlice'

const ModalRentFinish = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const { user } = useAuth()
  const { store } = useStore()
  const { addWork } = useCurrentWork()
  const { data: customers } = useCustomers()
  const items = order?.items || []
  const handleRentFinish = async () => {
    //*pickup items

    modal.setOpen(false)
    addWork({
      work: {
        type: 'order',
        action: 'rent_picked_up',
        details: {
          orderId: order.id
        }
      }
    })
    onRentFinish({ order, userId: user.id })
    onSendOrderWhatsapp({
      store,
      order,
      type: 'pickup',
      userId: user.id,
      customer: customers.find((customer) => customer.id === order.customerId)
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
