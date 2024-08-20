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
import { ErrorsList } from '../FormikErrorsList'

const ModalRentStart = ({ modal }: { modal: ReturnModal }) => {
  const { order } = useOrderDetails()
  const { user } = useAuth()
  const [isDirty, setIsDirty] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const handleRentStart = async () => {
    //*pickup items
    setIsLoading(true)
    await onRentStart({ order, userId: user.id })

    setIsLoading(false)
    modal.toggleOpen()
    return
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
              .then((res) => console.log(res))
              .catch((e) => console.error(e))
            return
          }}
          setDirty={(dirty) => {
            setIsDirty(dirty)
          }}
        />
        <ErrorsList
          errors={(() => {
            const errors = {}
            if (order?.items?.length <= 0)
              errors['items'] = 'Debes seleccionar al menos un item'
            return errors
          })()}
        />
        <Button
          disabled={isDirty || isLoading || !order?.items?.length}
          label="Entregar"
          onPress={async () => {
            return await handleRentStart()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalRentStart
