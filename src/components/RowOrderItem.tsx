import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RowItem from './RowItem'
import ButtonConfirm from './ButtonConfirm'
import FormItem from './FormItem'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { ServiceOrders } from '../firebase/ServiceOrders'
import Button from './Button'
import { gSpace } from '../styles'
import theme, { colors } from '../theme'
import { useStore } from '../contexts/storeContext'
import { ItemSelected } from './FormSelectItem'
import OrderType, { order_status, order_type } from '../types/OrderType'
import ItemType from '../types/ItemType'
import { useEmployee } from '../contexts/employeeContext'
import useMyNav from '../hooks/useMyNav'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Icon from './Icon'

export const RowOrderItem = ({
  item,
  onPressDelete,
  onEdit,
  order
}: {
  order: Partial<OrderType>
  item: ItemSelected
  onPressDelete?: () => void
  onEdit?: (values: ItemSelected) => void | Promise<void>
}) => {
  const { storeId, categories, storeSections } = useStore()
  const { permissions } = useEmployee()
  const { toItem } = useMyNav()
  const priceSelected = item.priceSelected
  const itemId = item.id
  const orderId = order.id

  const [itemAlreadyExist, setItemAlreadyExist] = useState(false)
  const [_item, _setItem] = useState<ItemSelected>(undefined)
  const createItem =
    order.type === order_type.RENT &&
    order.status === order_status.DELIVERED &&
    permissions.canManageItems

  // useEffect(() => {
  //   if (categories)
  //     ServiceStoreItems.get({ itemId: itemId, storeId })
  //       .then((res) => {
  //         if (res) {
  //           _setItem(res)
  //           setItemAlreadyExist(true)
  //         } else {
  //           setItemAlreadyExist(false)
  //         }
  //       })
  //       .catch((e) => {
  //         console.log({ e })
  //         setItemAlreadyExist(false)
  //         // setShouldCreateItem(true)
  //         const assignedSection = order?.assignToSection || ''
  //         const createEcoNumber = ({ section, brand, lastNumber }) => {
  //           let firstLetter = '' //* BRAND OF THE ITEM
  //           let secondLetter = '' //* SECTION OF THE ITEM
  //           let thirdLetter = '' //* INC NUMBER
  //           const string =
  //             storeSections.find((s) => s.id === section)?.name || 'S'
  //           const chunks = string.split(' ')
  //           firstLetter = brand?.[0] || 'S'
  //           secondLetter = chunks.map((chunk) => chunk[0]).join('')
  //           thirdLetter = lastNumber.toString(16).toUpperCase()
  //           return `${firstLetter}${secondLetter}${thirdLetter}`.toUpperCase()
  //         }
  //         const n = createEcoNumber({
  //           section: assignedSection,
  //           brand: item.brand,
  //           lastNumber: 0
  //         })
  //         console.log({ n })
  //         const category =
  //           categories?.find((cat) => cat?.name === item?.categoryName)?.id ||
  //           ''
  //         const defaultNumber = `${item?.brand?.[0] || 'S'}${item}`
  //         const serial = item?.serial || order?.itemSerial || ''
  //         const number = item?.number || n
  //         const brand = item?.brand || order?.itemBrand || ''
  //         const status: ItemType['status'] =
  //           order.status === order_status.DELIVERED ? 'rented' : 'pickedUp'

  //         const newItem = {
  //           status,
  //           assignedSection,
  //           category,
  //           categoryName: item.categoryName || '',
  //           brand,
  //           number,
  //           serial
  //         }
  //         console.log({ newItem })
  //         _setItem({ ...newItem })
  //       })
  // }, [itemId, categories])

  // console.log({ item, _item })
  useEffect(() => {
    ServiceStoreItems.get({ itemId, storeId }).then((res) => {
      if (res) {
        _setItem(res)
        setItemAlreadyExist(true)
      } else {
        _setItem(item)
        setItemAlreadyExist(false)
      }
    })
  }, [categories])
  console.log({ itemAlreadyExist })
  const createModal = useModal({ title: 'Crear articulo' })
  console.log({ _item })
  return (
    <View>
      <StyledModal {...createModal}>
        <FormItem
          values={_item}
          onSubmit={async (values) => {
            return await onEdit(values)
          }}
        />
      </StyledModal>
      <Pressable
        onPress={() => {
          if (itemAlreadyExist) {
            toItem({ id: itemId })
          } else {
            console.log('this items not exist', { itemId })

            const newItem = createNewItem({
              order,
              item,
              storeSections,
              storeCategories: categories
            })
            console.log({ newItem })
            _setItem(newItem)
            createModal.toggleOpen()
          }
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <RowItem
          item={{
            ..._item,
            priceSelected,
            categoryName: item.categoryName
          }}
          style={{
            marginVertical: gSpace(2),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.info,
            paddingHorizontal: gSpace(2),
            paddingVertical: gSpace(1),
            borderRadius: gSpace(2)
          }}
        />
        {/* {shouldCreateItem && createItem && (
        <ButtonConfirm
          handleConfirm={async () => {}}
          confirmLabel="Cerrar"
          confirmVariant="filled"
          openSize="small"
          openColor="success"
          icon="save"
          justIcon
          modalTitle="Crear item"
        >
          <View style={{ marginBottom: 8 }}>
            <FormItem
              values={_item}
              onSubmit={async (values) => {
                //* create item
                const res = await ServiceStoreItems.add({
                  item: values,
                  storeId
                }).then(({ res }) => {
                  if (res.id) {
                    ServiceOrders.updateItemId({
                      orderId,
                      itemId,
                      newItemId: res.id
                    })
                    //* update Order
                  }
                  console.log({ res })
                })
              }}
            />
          </View>
        </ButtonConfirm>
      )} */}
        {!!itemAlreadyExist ? (
          <Icon icon="done" color={colors.blue} />
        ) : (
          <Icon icon="add" color={colors.green} />
        )}
        {!!onEdit && (
          <ButtonConfirm
            handleConfirm={async () => {}}
            confirmLabel="Cerrar"
            confirmVariant="outline"
            openSize="small"
            openColor="info"
            icon="edit"
            justIcon
            modalTitle="Editar item"
          >
            <View style={{ marginBottom: 8 }}>
              <FormItem
                values={_item}
                onSubmit={async (values) => {
                  return await onEdit(values)
                }}
              />
            </View>
          </ButtonConfirm>
        )}
        {!!onPressDelete && (
          <Button
            buttonStyles={{ marginLeft: gSpace(2) }}
            icon="sub"
            color="error"
            justIcon
            onPress={onPressDelete}
            size="small"
          />
        )}
      </Pressable>
    </View>
  )
}

const createNewItem = ({
  order,
  item,
  storeSections,
  storeCategories
}): Partial<ItemType> => {
  const sectionAssigned = storeSections.find(
    (s) => s.id === order.assignToSection
  )
  const createEcoNumber = ({ section, brand, lastNumber }) => {
    let firstLetter = '' //* BRAND OF THE ITEM
    let secondLetter = '' //* SECTION OF THE ITEM
    let thirdLetter = '' //* INC NUMBER
    const string = storeSections.find((s) => s?.id === section)?.name || 'S'
    const chunks = string.split(' ')
    firstLetter = brand?.[0] || 'S'
    secondLetter = chunks.map((chunk) => chunk[0]).join('')
    thirdLetter = lastNumber.toString(16).toUpperCase()
    return `${firstLetter}${secondLetter}${thirdLetter}`.toUpperCase()
  }
  const number = createEcoNumber({
    section: sectionAssigned?.id,
    brand: item?.brand,
    lastNumber: 0
  })
  return {
    assignedSection: sectionAssigned?.id || '',
    assignedSectionName: sectionAssigned?.name || '',
    category: storeCategories.find((cat) => cat.name === item.categoryName)?.id,
    categoryName: item?.categoryName || '',
    brand: item?.brand || order?.itemBrand || '',
    number,
    serial: item?.serial || order?.itemSerial || '',
    status: order?.status === order_status.DELIVERED ? 'rented' : 'pickedUp'
  }
}

export default RowOrderItem
