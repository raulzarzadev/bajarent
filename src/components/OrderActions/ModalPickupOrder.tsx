import { StyleSheet, View } from 'react-native'
import React from 'react'
import StyledModal from '../StyledModal'
import OrderType from '../../types/OrderType'
import { ReturnModal } from '../../hooks/useModal'
import Button from '../Button'
import { ItemRow } from '../FormikSelectCategories'
import TextInfo from '../TextInfo'
import { onComment, onPickup } from '../../libs/order-actions'
import { useAuth } from '../../contexts/authContext'
import { onPickUpItem } from '../../firebase/actions/item-actions'
import { ServiceStoreItems } from '../../firebase/ServiceStoreItems'
import { useStore } from '../../contexts/storeContext'
import RowOrderItem from '../RowOrderItem'

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
        orderId: order.id
      })
        .then(async (res) => {
          if (
            !res.ok &&
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
    await onPickup({ orderId, userId: user.id })

    //* create movement
    await onComment({
      orderId: order.id,
      content: 'Recogida',
      storeId,
      type: 'comment'
    })
  }

  return (
    <View>
      <StyledModal {...modal}>
        <TextInfo
          text="Asegurate de que recoges el siguiente articulo:"
          defaultVisible
        />
        {items?.map((item, index) => {
          const category =
            categories.find((cat) => cat.name === item.categoryName)?.id || ''
          return (
            <RowOrderItem item={item} order={order} key={index} />
            // <ItemRow
            //   createItem={true}
            //   item={{
            //     ...item,
            //     category,
            //     assignedSection: order?.assignToSection || '',
            //     brand: order.itemBrand || '',
            //     serial: item.serial || order.itemSerial || ''
            //   }}
            //   orderId={order.id}
            //   key={index}
            //   onEdit={async (item) => {
            //     const editItem = {
            //       id: item.id || '',
            //       category,
            //       number: item.number || '',
            //       categoryName: item.categoryName || '',
            //       brand: item.brand || order.itemBrand || '',
            //       serial: item.serial || order.itemSerial || ''
            //     }

            //     await ServiceStoreItems.update({
            //       itemData: editItem,
            //       storeId,
            //       itemId: item.id
            //     })
            //       .then((res) => {
            //         console.log('item updated', res)
            //       })
            //       .catch(console.error)

            //     return
            //   }}
            // />
          )
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

const styles = StyleSheet.create({})
