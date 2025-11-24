import { Text } from 'react-native'
import { useEffect, useState } from 'react'
import Button from './Button'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { useOrderDetails } from '../contexts/orderContext'
import OrderType, { order_status, order_type } from '../types/OrderType'
import { useEmployee } from '../contexts/employeeContext'
import ItemType from '../types/ItemType'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { useStore } from '../contexts/storeContext'
import TextInfo from './TextInfo'
import FormItem from './FormItem'
import { ItemSelected } from './FormSelectItem'
import { CategoryType } from '../types/RentItem'
import StoreType from '../types/StoreType'
import { gStyles } from '../styles'

const ModalCreateOrderItem = ({ itemId }: { itemId: ItemType['id'] }) => {
  const { order } = useOrderDetails()

  const { storeId, categories, sections: storeSections } = useStore()
  const { permissions } = useEmployee()

  const [itemAlreadyExist, setItemAlreadyExist] = useState(undefined)
  const [_item, _setItem] = useState<ItemSelected>(undefined)

  const [progress, setProgress] = useState(0)
  const createModal = useModal({ title: 'Crear artículo' })

  const orderItemInfo = order?.items?.find((i) => i.id === itemId)

  const orderId = order?.id
  const isRent = order.type === order_type.RENT
  const isDeliveredRent = order.status === order_status.DELIVERED && isRent

  const canCreateItem =
    order.type === order_type.RENT &&
    order.status === order_status.DELIVERED &&
    permissions?.canCreateItems

  useEffect(() => {
    ServiceStoreItems.get({ itemId, storeId }).then((res) => {
      if (res) {
        _setItem(res)
        setItemAlreadyExist(true)
      } else {
        _setItem(orderItemInfo)
        setItemAlreadyExist(false)
      }
    })
  }, [categories])

  const handleCreteOrderItem = async (values: Partial<ItemType>) => {
    setProgress(20)
    //* 1. CREATE ITEM
    const newItem = await ServiceStoreItems.add({
      item: { ...values, createdOrderId: orderId || null },
      storeId
    })

      .then(async ({ res, newItem }) => {
        return { ...newItem, id: res?.id }
      })
      .catch((e) => console.log({ e }))
    setProgress(40)
    const itemCreated: Partial<ItemType> = { ...newItem }

    //* 2. UPDATE ORDER WITH THE NEW ITEM

    await ServiceOrders.updateItemId({
      orderId,
      itemId,
      newItemId: itemCreated.id,
      newItemCategoryName: itemCreated?.categoryName,
      newItemNumber: itemCreated.number
    })
      .then((res) => console.log({ res }))
      .catch((e) => console.log({ e }))
    setProgress(80)

    if (itemCreated.id) {
      //* 3. ADD ENTRY TO THE ITEM
      ServiceStoreItems.addEntry({
        storeId,
        itemId: itemCreated.id,
        entry: {
          type: 'created',
          content: 'Item creado y entregado',
          orderId: orderId || '',
          itemId
        }
      })
        .then((res) => {
          setProgress(100)
          console.log({ res })
        })
        .catch((e) => console.log({ e }))
    }

    return
  }

  return (
    <>
      {itemAlreadyExist === false && (
        <Button
          justIcon
          size="small"
          icon="add"
          color="success"
          variant="ghost"
          onPress={() => {
            createModal.toggleOpen()
          }}
        />
      )}
      <StyledModal {...createModal}>
        {!canCreateItem && (
          <TextInfo
            defaultVisible
            type="warning"
            text={`Para crear este artículo la orden  debe 
               ${!isRent ? 'ser RENTA ⏳. ' : ''} 
               ${!isDeliveredRent ? 'estar ENTREGADA 🏠. ' : ''}  
               ${!canCreateItem ? 'tener PERMISOS' : ''}`}
          />
        )}

        {canCreateItem && (
          <>
            <Text style={gStyles.h2}>Crea un artítculo nuevo</Text>

            <FormItem
              fromOrder
              values={{
                ...formatNewItem({
                  order,
                  item: orderItemInfo,
                  storeSections,
                  storeCategories: categories
                })
              }}
              onSubmit={async (values) => {
                return handleCreteOrderItem(values)
              }}
              progress={progress}
            />
          </>
        )}
      </StyledModal>
    </>
  )
}

export default ModalCreateOrderItem

const formatNewItem = ({
  order,
  item,
  storeSections = [],
  storeCategories
}: {
  order: Partial<OrderType>
  item: ItemSelected
  storeSections: StoreType['sections']
  storeCategories: Partial<CategoryType>[]
}): Partial<ItemType> => {
  const sectionAssigned = storeSections.find(
    (s) => s.id === order.assignToSection
  )

  return {
    assignedSection: sectionAssigned?.id || '',
    assignedSectionName: sectionAssigned?.name || '',
    category: storeCategories?.find((cat) => cat?.name === item?.categoryName)
      ?.id,
    categoryName: item?.categoryName || '',
    brand: item?.brand || order?.itemBrand || '',
    //number:,
    serial: item?.serial || order?.itemSerial || '',
    status: order?.status === order_status.DELIVERED ? 'rented' : 'pickedUp'
  }
}
