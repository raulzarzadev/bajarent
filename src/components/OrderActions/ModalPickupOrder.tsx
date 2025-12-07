import { View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import { useStore } from '../../contexts/storeContext'
import { onPickUpItem } from '../../firebase/actions/item-actions'
import type { FormattedResponse } from '../../firebase/firebase.CRUD'
import { ServiceStoreItems } from '../../firebase/ServiceStoreItems'
import type { ReturnModal } from '../../hooks/useModal'
import { onRentPickup } from '../../libs/order-actions'
import type OrderType from '../../types/OrderType'
import Button from '../Button'
import RowOrderItem from '../RowOrderItem'
import StyledModal from '../StyledModal'
import TextInfo from '../TextInfo'

const ModalPickupOrder = ({
  modal,
  order
}: {
  modal: ReturnModal
  order: Partial<OrderType>
}) => {
  const shouldCreateItemIfNotExists = true
  const storeId = order?.storeId
  const orderId = order?.id
  const items = order?.items
  const { user } = useAuth()
  const { categories } = useStore()
  const getCategoryId = (category) => {
    return categories.find(
      (cat) => cat.name === category || cat.id === category
    )?.id
  }
  const handlePickup = async () => {
    //*pickup items
    modal.setOpen(false)
    items.forEach(async (item) => {
      const res = await onPickUpItem({
        storeId,
        itemId: item.id,
        orderId: order.id,
        assignToSection: order?.assignToSection || ''
      })
        .then(async (res: FormattedResponse) => {
          if (
            !res?.ok &&
            res?.res?.code === 'not-found' &&
            shouldCreateItemIfNotExists
          ) {
            console.log('create item')
            return await ServiceStoreItems.add({
              item: {
                status: 'pickedUp',
                assignedSection: order?.assignToSection || '',
                brand: order.itemBrand || '',
                categoryName: item.categoryName || '',
                number: item.number || '',
                serial: item.serial || order.itemSerial || '',
                category: getCategoryId(item.categoryName) || ''
              },
              storeId
            })
            //TODO: add history
          } else {
            return true
          }
        })
        .catch(console.error)
    })
    //* pickup order
    await onRentPickup({ orderId, userId: user.id, storeId })
  }

  return (
    <View>
      <StyledModal {...modal}>
        <TextInfo
          text="Asegurate de que recoges el siguiente articulo:"
          defaultVisible
        />
        {items?.map((item) => {
          return <RowOrderItem item={item} order={order} key={item.id} />
        })}

        <Button
          label="Recoger"
          onPress={() => {
            handlePickup()
          }}
        ></Button>
      </StyledModal>
    </View>
  )
}

export default ModalPickupOrder
