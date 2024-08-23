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
import { useStore } from '../../contexts/storeContext'
import { order_type } from '../../types/OrderType'

const ModalRentStart = ({ modal }: { modal: ReturnModal }) => {
  const { store } = useStore()
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
  const VALIDATE_ITEMS_QTY =
    store.orderFields?.[order_type.RENT]?.validateItemsQty
  const ITEMS_MAX_BY_ORDER = parseInt(
    store.orderFields?.[order_type.RENT]?.itemsMax || '0'
  )
  const ITEMS_MIN_BY_ORDER = parseInt(
    store.orderFields?.[order_type.RENT]?.itemsMin || '0'
  )

  const itemsCount = order?.items?.length || 0
  const toMuchItems = itemsCount > ITEMS_MAX_BY_ORDER
  const toLittleItems = itemsCount < ITEMS_MIN_BY_ORDER
  const disabledByCountItems =
    VALIDATE_ITEMS_QTY && (toMuchItems || toLittleItems)

  const disabledDelivery = isDirty || isLoading || disabledByCountItems
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
            if (VALIDATE_ITEMS_QTY) {
              console.log({ itemsCount, ITEMS_MAX_BY_ORDER })
              if (toMuchItems) {
                errors[
                  'items'
                ] = `Selecciona máximo ${ITEMS_MAX_BY_ORDER} artículo(s)`
              }

              if (toLittleItems) {
                errors[
                  'items'
                ] = `Selecciona mínimo ${ITEMS_MIN_BY_ORDER} artículo(s)`
              }
            }

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
