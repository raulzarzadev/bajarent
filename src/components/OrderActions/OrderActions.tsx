import { ScrollView, Text, View } from 'react-native'
import { useAuth } from '../../contexts/authContext'
import {
  onAuthorize,
  onDelivery,
  onPickup,
  onRenew,
  onRepairFinish,
  onRepairStart,
  onPending,
  onComment,
  onCancel
} from '../../libs/order-actions'
import OrderType, { order_status } from '../../types/OrderType'
import OrderAssignInfo from '../OrderAssignInfo'
import Button from '../Button'
import dictionary from '../../dictionary'
import ProgressBar from '../ProgressBar'
import OrderCommonActions from './OrderCommonActions'
import { useEmployee } from '../../contexts/employeeContext'
import { gSpace, gStyles } from '../../styles'
import { CommentType } from '../ListComments'
import ErrorBoundary from '../ErrorBoundary'
import StyledModal from '../StyledModal'
import useModal from '../../hooks/useModal'
import { Formik } from 'formik'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import InputLocationFormik from '../InputLocationFormik'
import InputValueFormik from '../FormikInputValue'
import FormikSelectCategories from '../FormikSelectCategories'
import { orderExpireAt } from '../../libs/orders'
import FormikInputImage from '../FormikInputImage'
import { useEffect, useState } from 'react'
import { getFullOrderData } from '../../contexts/libs/getFullOrderData'
import FormItemPickUp from './FormItemPickUp'
import { useStore } from '../../contexts/storeContext'
import { onCreateItem, onPickUpItem, onRentItem } from '../../libs/item_actions'
import { ItemSelected } from '../FormSelectItem'
import ModalDeliveryOrder from './ModalDeliveryOrder'
import ModalPickupOrder from './ModalPickupOrder'

// #region ENUM ACTIONS
enum acts {
  AUTHORIZE = 'AUTHORIZE',
  DELIVER = 'DELIVER',
  PICKUP = 'PICKUP',
  RENEW = 'RENEW',
  COMMENT = 'COMMENT',
  REPAIR_START = 'REPAIR_START',
  REPAIR_FINISH = 'REPAIR_FINISH',
  CANCEL = 'CANCEL'
}

// #region TYPES
export type OrderTypes = 'RENT' | 'SALE' | 'REPAIR'
export type OrderActionsType = {
  orderId: string
  orderType: OrderTypes
  orderStatus: OrderType['status']
  storeId: string
}

// #region FUNCTION
const OrderActions = ({
  orderId,
  orderType,
  orderStatus,
  storeId
}: OrderActionsType) => {
  const { permissions } = useEmployee()
  const { user } = useAuth()
  const { items: storeItems, categories: storeCategories } = useStore()
  const userId = user?.id

  // #region  ACTIONS FUNCTIONS
  // Resume in one place tha functions that will be called some times
  const onOrderComment = async ({
    content,
    type = 'comment'
  }: {
    content: string
    type?: CommentType['type']
  }) => {
    return await onComment({ orderId, content, storeId, type })
  }

  // #region HOOKS

  const deliveryModal = useModal({ title: 'Confirmar datos de entrega' })

  // const { order } = useOrder({ orderId })
  const [order, setOrder] = useState<OrderType>()
  const [touchedPickedUp, setTouchedPickedUp] = useState(false)

  useEffect(() => {
    getFullOrderData(orderId).then((order) => {
      setOrder(order)
    })
  }, [orderId])

  // #region ACTIONS

  const actions_fns = {
    [acts.DELIVER]: async (
      values?: Pick<
        OrderType,
        'location' | 'itemSerial' | 'items' | 'note' | 'imageID' | 'imageHouse'
      >
    ) => {
      const location = values?.location || ''
      const itemSerial = values?.itemSerial || ''
      const items = values?.items || []
      const note = values?.note || ''
      const imageID = values?.imageID || ''
      const imageHouse = values?.imageHouse || ''

      try {
        await ServiceOrders.update(orderId, {
          location,
          itemSerial,
          items,
          note,
          imageID,
          imageHouse
        })
        const expireAt = orderExpireAt({
          order: { ...order, deliveredAt: new Date(), items }
        })
        console.log({ expireAt })
        await onDelivery({
          orderId,
          userId,
          expireAt,
          items: items
        })
        await onOrderComment({ content: 'Entregada' })
      } catch (error) {
        console.log(error)
      }
    },
    [acts.PICKUP]: async () => {
      try {
        await onPickup({ orderId, userId })
        await onOrderComment({ content: 'Recogida' })
        if (touchedPickedUp) {
          await getFullOrderData(orderId).then(setOrder)
        }
      } catch (error) {
        console.log(error)
      }
    },
    [acts.RENEW]: async () => {
      try {
        await onRenew({ orderId, userId })
        await onOrderComment({ content: 'Renovada' })
      } catch (error) {
        console.log(error)
      }
    },
    [acts.REPAIR_START]: async () => {
      try {
        await onRepairStart({ orderId, userId })
        await onOrderComment({ content: 'Reparación comenzada' })
      } catch (error) {
        console.log(error)
      }
    },
    [acts.REPAIR_FINISH]: async () => {
      try {
        await onRepairFinish({ orderId, userId })
        await onOrderComment({ content: 'Reparación terminada' })
      } catch (error) {
        console.log(error)
      }
    },

    //* this are part of common actions

    [acts.AUTHORIZE]: async () => {
      try {
        await onAuthorize({ orderId, userId })
        await onOrderComment({ content: 'Autorizada' })
      } catch (error) {
        console.log(error)
      }
    },
    [acts.CANCEL]: async () => {
      try {
        await onCancel({ orderId, userId })
        await onOrderComment({ content: 'Cancelada' })
      } catch (error) {
        console.log(error)
      }
    }
  }

  //TODO: should not be able to do some actions depends of the status // yes , absolutely
  //TODO: should not be able to do some actions depends of the permissions // yes , absolutely
  //* the things is that some actions should change props like deliveredAt, authorizedAt, etc, this is ok but
  //* you want to be shure that not change this props if the status is not the correct one
  // if rent is expired -> can't cancel delivered authorized
  // if rent is expired -> just can renew or pickup

  // rent can deliver -> is authorized
  // rent can pickup -> is delivered , expired
  // rent can renew -> is delivered , expired
  // rent can cancel -> is pending, authorized

  // #region USER PERMISSIONS
  /* ********************************************
   * USER PERMISSIONS
   *******************************************rz */
  const employeeOrderPermissions = permissions?.orders
  const isAdmin = permissions.isAdmin
  const isOwner = permissions.isOwner

  const userCanAuthorize =
    employeeOrderPermissions?.canAuthorize || isAdmin || isOwner
  const userCanRenew = employeeOrderPermissions?.canRenew || isAdmin || isOwner
  const userCanCancel =
    employeeOrderPermissions?.canCancel || isAdmin || isOwner
  const userCanEdit = employeeOrderPermissions?.canEdit || isAdmin || isOwner
  const userCanDelete =
    employeeOrderPermissions?.canDelete || isAdmin || isOwner
  const userCanSendWS =
    employeeOrderPermissions?.canSentWS || isAdmin || isOwner
  const userCanAssign =
    employeeOrderPermissions?.canAssign || isAdmin || isOwner
  const userCanReorder =
    employeeOrderPermissions?.canReorder || isAdmin || isOwner
  const userCanExtend =
    employeeOrderPermissions?.canExtend || isAdmin || isOwner
  /* ********************************************
   * ORDER ACTIONS ALLOWED
   *******************************************rz */

  /* ********************************************
   * IF ORDER IS RENT
   *******************************************rz */

  const isRent = orderType === 'RENT'

  //****DELIVER JUST IF IS AUTH
  const canDeliverRent = isRent && orderStatus === order_status.AUTHORIZED
  //**** PICKUP JUST IF IS DELIVERED OR EXPIRED
  const canPickupRent =
    isRent &&
    (orderStatus === order_status.DELIVERED ||
      orderStatus === order_status.EXPIRED)

  /* ********************************************
   * IF ORDER IS REPAIR
   *******************************************rz */

  const isRepair = orderType === 'REPAIR'

  //**** PICKUP JUST IF IS AUTHORIZED
  const canPickupRepair = isRepair && orderStatus === order_status.AUTHORIZED
  //**** REPAIR START JUST IF IS AUTHORIZED
  const canStartRepair = isRepair && orderStatus === order_status.PICKED_UP
  //**** REPAIR FINISH JUST IF IS REPAIRING
  const canFinishRepair = isRepair && orderStatus === order_status.REPAIRING
  //**** DELIVER JUST IF IS REPAIRED
  const canDeliverRepair = isRepair && orderStatus === order_status.REPAIRED
  //**** CANCEL JUST IF IS PENDING OR AUTHORIZED

  /* ********************************************
   * IF ORDER IS SALE
   *******************************************rz */

  const isSale = orderType === 'SALE'
  //****DELIVER JUST IF IS AUTH
  const canDeliverSale = isSale && orderStatus === order_status.AUTHORIZED
  //**** CANCEL JUST IF IS PENDING OR AUTHORIZED OR DELIVERED

  // #region PERMISSION FLOWS
  /* ********************************************
   * ORDER FLOWS
   *******************************************rz */
  const orderPermissions = permissions.orders

  const employeeCanDelivery = orderPermissions.canDelivery || isAdmin || isOwner

  const employeeCanPickup = orderPermissions.canPickup || isAdmin || isOwner

  const employeeCanStartRepair =
    orderPermissions.canStartRepair || isAdmin || isOwner

  const employeeCanFinishRepair =
    orderPermissions.canFinishRepair || isAdmin || isOwner

  const employeeCanUndo = orderPermissions.canUndo || isAdmin || isOwner

  const employeeCanUnAuthorize =
    orderPermissions.canUnAuthorize || isAdmin || isOwner
  const employeeCanAuthorize =
    orderPermissions.canAuthorize || isAdmin || isOwner

  // #region FLOWS
  /* ******************************************** 
             SALE FLOW               
   *******************************************rz */
  const SALE_FLOW = [
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED,
      disabled: !canDeliverSale || !employeeCanDelivery
    }
  ]
  /* ******************************************** 
             RENT FLOW               
   *******************************************rz */
  const modalPickUpRent = useModal({ title: 'Recoger artículos' })
  const handlePickUpRent = () => {
    modalPickUpRent.toggleOpen()
  }

  const RENT_FLOW = [
    {
      label: 'Deliver',
      action: deliveryModal.toggleOpen,
      status: order_status.DELIVERED,
      disabled: !canDeliverRent || !employeeCanDelivery
    },
    {
      label: 'Pickup',
      action: handlePickUpRent,
      status: order_status.PICKED_UP,
      disabled: !canPickupRent || !employeeCanPickup
    }
  ]

  /* ******************************************** 
             REPAIR FLOW               
   *******************************************rz */
  const modalPickUpRepair = useModal({ title: 'Recoger reparación' })
  const handlePickupRepair = () => {
    modalPickUpRepair.toggleOpen()
    //actions_fns[acts.PICKUP]()
  }
  const REPAIR_FLOW = [
    {
      label: 'Pickup',
      action: handlePickupRepair,
      status: order_status.PICKED_UP,
      disabled: !canPickupRepair || !employeeCanPickup
    },
    {
      label: 'Repair start',
      action: actions_fns[acts.REPAIR_START],
      status: order_status.REPAIRING,
      disabled: !canStartRepair || !employeeCanStartRepair
    },
    {
      label: 'Repair finish',
      action: actions_fns[acts.REPAIR_FINISH],
      status: order_status.REPAIRED,
      disabled: !canFinishRepair || !employeeCanFinishRepair
    },
    {
      label: 'Deliver',
      action: actions_fns[acts.DELIVER],
      status: order_status.DELIVERED,
      disabled: !canDeliverRepair || !employeeCanDelivery
    }
  ]
  /* ******************************************** 
             FLOWS              
   *******************************************rz */

  const ORDER_TYPE_ACTIONS = {
    RENT: RENT_FLOW,
    SALE: SALE_FLOW,
    REPAIR: REPAIR_FLOW
  }

  /* ********************************************
   * ORDER PROGRESS FLOW
   *******************************************rz */
  // #region PROGRESS
  const statusIndex = ORDER_TYPE_ACTIONS[orderType].findIndex(
    (act) => act.status === orderStatus //*!<- if is reported it don't found
  )
  const progress =
    ((statusIndex + 1) / ORDER_TYPE_ACTIONS[orderType].length) * 100

  /* ********************************************
   * RESUME
   *******************************************rz */

  const canAuthorize =
    userCanAuthorize &&
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.CANCELLED)

  const canRenew =
    userCanRenew &&
    (orderStatus === order_status.DELIVERED ||
      orderStatus === order_status.EXPIRED)

  const canCancel =
    userCanCancel &&
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.AUTHORIZED)

  const canExtend =
    isRent &&
    userCanExtend &&
    (orderStatus === order_status.DELIVERED ||
      orderStatus === order_status.EXPIRED)

  const canReorder = userCanReorder

  const canEdit = userCanEdit
  const canDelete = userCanDelete
  const canSendWS = userCanSendWS
  const canAssign = userCanAssign

  const handleBack = () => {
    const index = statusIndex
    const action = ORDER_TYPE_ACTIONS[orderType][index - 1]
    if (!action) {
      onAuthorize({ orderId, userId })
    } else {
      action.action()
    }
  }
  const showAuthorizeButton =
    (orderStatus === order_status.PENDING ||
      orderStatus === order_status.CANCELLED) &&
    employeeCanAuthorize

  //TODO: check if this is correct

  const showBackButton =
    !showAuthorizeButton &&
    orderStatus !== order_status.AUTHORIZED &&
    employeeCanUndo

  // const showPendingButton =
  //   orderStatus === order_status.AUTHORIZED && employeeCanUnAuthorize
  // #region COMPONENT

  //const [newItems, setNewItems] = useState<OrderType['items']>([])

  // const handleCollectItems = async () => {
  //   await handleCreateItemsIfNecessary({ items: newItems }) //* this will create items that not exists
  //     .then(console.log)
  //     .catch(console.error)

  //   await handlePickUpItems({ itemsIds: newItems.map((i) => i.id) }) //* update items as picked up
  //     .then(console.log)
  //     .catch(console.error)
  //   actions_fns[acts.PICKUP]()

  //   modalPickUpRent.setOpen(false)
  // }

  // const handlePickUpItems = async ({ itemsIds }: { itemsIds: string[] }) => {
  //   itemsIds.map(async (itemId) => {
  //     // return await onPickUpItem({ itemId, storeId })
  //   })
  //   return await Promise.all(itemsIds)
  // }

  // const handleCreateItemsIfNecessary = async ({
  //   items
  // }: {
  //   items: OrderType['items']
  // }) => {
  //   items.forEach(async (item) => {
  //     const itemAlreadyExists = storeItems?.find(
  //       (storeItem) => storeItem.id === item.id
  //     )
  //     if (!!itemAlreadyExists) return
  //     const categoryId = storeCategories.find(
  //       (c) => c.name === item.categoryName
  //     )?.id
  //     // return await onCreateItem({
  //     //   storeId,
  //     //   item: {
  //     //     id: item.id,
  //     //     assignedSection: order?.assignToSection || '',
  //     //     serial: item.serial || '',
  //     //     brand: item.brand || '',
  //     //     number: item.number || '',
  //     //     category: categoryId || '',
  //     //     status: 'available'
  //     //   },
  //     //   itemId: item.id,
  //     //   userId: user?.id || ''
  //     // })
  //   })
  // }

  return (
    <View>
      <StyledModal {...modalPickUpRepair}>
        <View>
          <Formik
            initialValues={{ ...order }}
            onSubmit={async (values) => {
              console.log({ values })
              await ServiceOrders.update(orderId, { ...values })
                .then(console.log)
                .catch(console.error)
              await actions_fns[acts.PICKUP]()
              modalPickUpRepair.setOpen(false)
            }}
            validate={(values: OrderType) => {
              const errors: Partial<OrderType> = {}
              if (!values.location) errors.location = 'Ubicación requerida'
              if (
                !values.itemSerial &&
                (values.type === 'RENT' || values.type === 'REPAIR')
              )
                errors.itemSerial = 'No. de serie es requerido'
              return errors
            }}
          >
            {({ errors, handleSubmit, isSubmitting, dirty }) => {
              return (
                <View>
                  <View style={{ marginVertical: 8 }}>
                    <InputValueFormik
                      name={'note'}
                      placeholder="Nota"
                      helperText={'Numero de nota o referencia externa'}
                    />
                  </View>
                  <View style={{ marginVertical: 8 }}>
                    <InputValueFormik
                      name={'itemSerial'}
                      placeholder="No. de serie"
                      helperText={'Numero de serie'}
                    />
                  </View>
                  <View style={{ marginVertical: 8 }}>
                    <InputValueFormik
                      name={'itemBrand'}
                      placeholder="Marca"
                      helperText={'Marca del articulo'}
                    />
                  </View>
                  <View style={{ marginVertical: 8 }}>
                    <InputLocationFormik
                      name={'location'}
                      helperText={'Ubicación con link o coordenadas'}
                    />
                  </View>

                  <View style={{ marginVertical: 8 }}>
                    <FormikInputImage
                      name="imageHouse"
                      label="Subir fachada "
                    />
                  </View>
                  <Button
                    disabled={Object.keys(errors).length > 0 || isSubmitting}
                    label="Recoger"
                    onPress={async () => {
                      handleSubmit()
                      if (dirty) {
                        setTouchedPickedUp(true)
                        console.log('touched')
                      }
                    }}
                  />
                </View>
              )
            }}
          </Formik>
        </View>
      </StyledModal>

      <ModalDeliveryOrder order={order} deliveryModal={deliveryModal} />

      <ModalPickupOrder order={order} modal={modalPickUpRent} />
      {/* 
      // #region FLOW 
    */}
      <ScrollView
        horizontal
        style={{ maxWidth: '100%', marginHorizontal: 'auto' }}
        //style={{ flexDirection: 'row', justifyContent: 'space-around' }}
      >
        {false && (
          <Button
            label="Pendiente"
            onPress={() => {
              onPending({ orderId })
            }}
            size="xs"
            variant="ghost"
          />
        )}
        {false && (
          <Button
            label="Autorizar"
            onPress={() => {
              actions_fns[acts.AUTHORIZE]()
            }}
            size="xs"
            variant="ghost"
          />
        )}
        {showBackButton && (
          <Button
            label={'Atras'}
            onPress={() => {
              handleBack()
            }}
            variant="ghost"
            size="xs"
            icon="undo"
          />
        )}

        {ORDER_TYPE_ACTIONS[orderType].map(({ label, action, disabled }) => (
          <Button
            key={label}
            label={dictionary(label)}
            onPress={action}
            variant="ghost"
            size="xs"
            disabled={disabled}
          />
        ))}
      </ScrollView>
      <View style={{ padding: 4, marginTop: 8 }}>
        <ProgressBar progress={progress} />
      </View>

      {/* 
          ASSIGN INFO
      */}
      <OrderAssignInfo orderId={orderId} />

      {/* 
      // #region COMMON ACTIONS 
      */}

      {!!order?.statuses && (
        <Text style={{ textAlign: 'center' }}>Statuses OK</Text>
      )}

      <OrderCommonActions
        storeId={storeId}
        userId={userId}
        orderId={orderId}
        actionsAllowed={{
          canRenew,
          canCancel,
          canEdit,
          canDelete,
          canSendWS,
          canAuthorize,
          canAssign,
          canReorder,
          canExtend
        }}
      />
    </View>
  )
}

//#region Error boundary
export const OrderActionsE = (props: OrderActionsType) => {
  return (
    <ErrorBoundary componentName="OrderActions">
      <OrderActions {...props} />
    </ErrorBoundary>
  )
}
export default OrderActions
