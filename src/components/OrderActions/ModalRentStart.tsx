import { View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { onRentStart } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { useOrderDetails } from '../../contexts/orderContext'
import TextInfo from '../TextInfo'
import FormRentDelivery from './FormRentDelivery'
import { ServiceOrders } from '../../firebase/ServiceOrders'

const ModalRentStart = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const { user } = useAuth()
  const handleRentStart = async () => {
    //*pickup items
    onRentStart({ order, userId: user.id })
  }

  return (
    <View>
      <StyledModal {...modal}>
        <View>
          <TextInfo
            defaultVisible
            text="Asegurate de que ENTREGAS el siguiente artículo"
          />
        </View>

        <FormRentDelivery
          initialValues={order}
          onSubmit={async (values) => {
            await ServiceOrders.update(order.id, values)
            return
          }}
        />
        <Button
          label="Entregar"
          onPress={() => {
            handleRentStart()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalRentStart
