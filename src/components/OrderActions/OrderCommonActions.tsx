import { Text, View } from 'react-native'
import ModalAssignOrder from './ModalAssignOrder'
import Button from '../Button'
import {
  onAuthorize,
  onCancel,
  onComment,
  onDelete,
  onSetStatuses
} from '../../libs/order-actions'
import ButtonConfirm from '../ButtonConfirm'
import { useNavigation } from '@react-navigation/native'
import { CommentType } from '../ListComments'
import AddExtendExpire from './AddExtendExpire'
import ButtonCopyRow from './ButtonCopyRow'
import { ModalSendWhatsappE } from '../ModalSendWhatsapp'
import ButtonDeleteOrder from './ButtonDeleteOrder'
import ModalScheduleOrder from './ModalScheduleOrder'
import { useOrderDetails } from '../../contexts/orderContext'
import ErrorBoundary from '../ErrorBoundary'
import InputTextStyled from '../InputTextStyled'
import { useState } from 'react'
import { ContactType } from '../../types/OrderType'
import unShortUrl from '../../libs/unShortUrl'
import extractCoordsFromUrl from '../../libs/extractCoordsFromUrl'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { or } from 'firebase/firestore'
import ButtonSetOrderLocation from './ButtonSetOrderLocation'
import containsCoordinates from '../../libs/containCoordinates'
export type OrderCommonActionsType = {
  storeId: string
  orderId: string
  actionsAllowed: {
    canRenew?: boolean
    canCancel?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canSendWS?: boolean
    canAuthorize?: boolean
    canReorder?: boolean
    canAssign?: boolean
    canExtend?: boolean
  }
  userId: string
}
const OrderCommonActions = ({
  storeId,
  actionsAllowed,
  orderId,
  userId
}: OrderCommonActionsType) => {
  const onOrderComment = ({
    content,
    type = 'comment'
  }: {
    content: string
    type?: CommentType['type']
  }) => {
    onComment({ orderId, content, storeId, type })
  }
  const { order } = useOrderDetails()
  const { navigate, goBack } = useNavigation()
  const [cancelledReason, setCancelledReason] = useState('')

  const canCancel = actionsAllowed?.canCancel
  const canEdit = actionsAllowed?.canEdit
  const canDelete = actionsAllowed?.canDelete
  const canSendWS = actionsAllowed?.canSendWS
  const canAuthorize = actionsAllowed?.canAuthorize
  const canReorder = actionsAllowed?.canReorder
  const canAssign = actionsAllowed?.canAssign
  const canExtend = actionsAllowed?.canExtend
  const canRenew = actionsAllowed?.canRenew
  const canCopy = true

  const handleReorder = () => {
    // @ts-ignore

    navigate('ReorderOrder', { orderId })
  }
  const handleEdit = () => {
    // @ts-ignore
    navigate('Orders')
    // navigate('Orders', { screen: 'EditOrder', params: { orderId } }) //! this ignore de Root stack
    // @ts-ignore
    navigate('EditOrder', { orderId })
  }
  const handleRenew = () => {
    // @ts-ignore
    navigate('RenewOrder', { orderId })
  }
  const handleDelete = async () => {
    try {
      await onDelete({ orderId })
      goBack()
    } catch (error) {
      console.log({ error })
    }
  }
  const handleAuthorize = async () => {
    await onAuthorize({ orderId, userId })
    onOrderComment({ content: 'Autorizada' })
  }
  const handleCancel = async () => {
    return await onCancel({ orderId, userId, cancelledReason }).then(() => {
      onOrderComment({ content: 'Cancelada' })
    })
  }

  const handleUpdateStatuses = async () => {
    onSetStatuses({ orderId })
  }

  const orderContacts = order?.contacts as ContactType[]
  const defaultWhatsappPhone =
    orderContacts?.find((c) => c.isFavorite)?.phone ||
    orderContacts?.[0]?.phone ||
    order.phone ||
    ''

  const buttons = [
    canAssign && <ModalScheduleOrder orderId={orderId} />,
    canAssign && (
      <ModalAssignOrder orderId={orderId} section={order?.assignToSection} />
    ),
    canExtend && <AddExtendExpire orderId={orderId} storeId={storeId} />,
    canSendWS && <ModalSendWhatsappE whatsappPhone={defaultWhatsappPhone} />,
    canReorder && (
      <Button
        label="Re-ordenar"
        onPress={() => {
          handleReorder()
        }}
        size="small"
        icon="refresh"
      />
    ),
    canAuthorize && (
      <Button
        label="Autorizar"
        onPress={() => {
          handleAuthorize()
        }}
        size="small"
      />
    ),
    canRenew && (
      <Button
        label="Renovar"
        onPress={() => {
          handleRenew()
        }}
        size="small"
        icon="add"
      />
    ),
    <ButtonSetOrderLocation />
  ]
  const buttons2 = [
    canEdit && (
      <Button
        size="small"
        label="Editar"
        onPress={() => {
          handleEdit()
        }}
        variant="outline"
        icon="edit"
      />
    ),
    canDelete && <ButtonDeleteOrder orderId={orderId} />,
    canCancel && (
      <ButtonConfirm
        openLabel="Cancelar"
        modalTitle="Cancelar orden"
        openVariant="outline"
        openColor="info"
        openSize="small"
        icon="cancel"
        confirmLabel="Cancelar orden"
        confirmVariant="outline"
        confirmColor="info"
        handleConfirm={async () => {
          return await handleCancel()
        }}
      >
        <Text>
          Cancelar orden. Si necesitas retomarla en cualquer momento debes tener
          permiso para autorizar ordenes o pidele a tu administrador que lo
          haga.
        </Text>
        <InputTextStyled
          label="Motivo de cancelación"
          placeholder="Escribe el motivo de cancelación"
          onChangeText={(value) => {
            setCancelledReason(value)
          }}
          value={cancelledReason}
        />
      </ButtonConfirm>
    ),
    canCopy && <ButtonCopyRow orderId={orderId} />,
    false && (
      <>
        <ButtonConfirm
          text="Desea actualizar los estados a statuses"
          openLabel="Statuses"
          openSize="small"
          openVariant="outline"
          handleConfirm={handleUpdateStatuses}
        />
      </>
    )
  ]
  return (
    <View>
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          padding: 2,
          flexWrap: 'wrap'
        }}
      >
        {buttons.map(
          (button, i) =>
            button && (
              <View key={i} style={{ padding: 4, width: '50%' }}>
                {button}
              </View>
            )
        )}
        {/* To fix las element */}
        <View style={{ flex: 1 }} />
      </View>
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          padding: 2,
          flexWrap: 'wrap'
        }}
      >
        {buttons2.map(
          (button, i) =>
            button && (
              <View key={i} style={{ padding: 4, width: '50%' }}>
                {button}
              </View>
            )
        )}
        {/* To fix las element */}
        <View style={{ flex: 1 }} />
      </View>
    </View>
  )
}

export const OrderCommonActionsE = (props: OrderCommonActionsType) => (
  <ErrorBoundary componentName="OrderCommonActions">
    <OrderCommonActions {...props} />
  </ErrorBoundary>
)
export default OrderCommonActions
