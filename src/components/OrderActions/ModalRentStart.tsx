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
// const MAX_ITEMS_PER_ORDER = 1
// const MIN_ITEMS_PER_ORDER = 1
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

  const itemsCount = order?.items?.length || 0
  // const toMuchItems = itemsCount > MAX_ITEMS_PER_ORDER
  // const toLittleItems = itemsCount < MIN_ITEMS_PER_ORDER
  // const disabledByCountItems = toMuchItems || toLittleItems

  const disabledDelivery = isDirty || isLoading || itemsCount < 1
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
            // if (toMuchItems) {
            //   errors[
            //     'items'
            //   ] = `Solo puedes seleccionar ${MAX_ITEMS_PER_ORDER} item(s)`
            //   return
            // }

            // if(toLittleItems) {
            //   errors['items'] = `Debes seleccionar al menos ${MIN_ITEMS_PER_ORDER} item(s)`
            //   return errors
            // }
            if (itemsCount < 1)
              errors['items'] = 'Debes seleccionar al menos un item'
            return errors
          })()}
        />
        <Button
          disabled={disabledDelivery}
          variant={disabledDelivery ? 'ghost' : 'filled'}
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
