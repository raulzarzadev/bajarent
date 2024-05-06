import { View } from 'react-native'
import ModalWhatsAppOrderStatus from './ModalWhatsAppOrderStatus'
import ModalAssignOrder from './ModalAssignOrder'
import Button from '../Button'
import {
  onAuthorize,
  onCancel,
  onComment,
  onDelete
} from '../../libs/order-actions'
import ButtonConfirm from '../ButtonConfirm'
import { useNavigation } from '@react-navigation/native'
import { CommentType } from '../ListComments'
import AddExtendExpire from './AddExtendExpire'
import ButtonCopyRow from './ButtonCopyRow'

const OrderCommonActions = ({
  storeId,
  actionsAllowed,
  orderId,
  userId
}: {
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
}) => {
  const onOrderComment = ({
    content,
    type = 'comment'
  }: {
    content: string
    type?: CommentType['type']
  }) => {
    onComment({ orderId, content, storeId, type })
  }
  const { navigate, goBack } = useNavigation()
  const canCancel = actionsAllowed.canCancel
  const canEdit = actionsAllowed.canEdit
  const canDelete = actionsAllowed.canDelete
  const canSendWS = actionsAllowed.canSendWS
  const canAuthorize = actionsAllowed.canAuthorize
  const canReorder = actionsAllowed.canReorder
  const canAssign = actionsAllowed.canAssign
  const canExtend = actionsAllowed.canExtend
  const canRenew = actionsAllowed.canRenew
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
    return await onCancel({ orderId, userId }).then(() => {
      onOrderComment({ content: 'Cancelada' })
    })
  }

  const buttons = [
    canAssign && <ModalAssignOrder orderId={orderId} />,
    canExtend && <AddExtendExpire orderId={orderId} storeId={storeId} />,
    canSendWS && <ModalWhatsAppOrderStatus orderId={orderId} />,

    canReorder && (
      <Button
        label="Reordenar"
        onPress={() => {
          handleReorder()
        }}
        size="small"
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
      />
    )
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
    canDelete && (
      <ButtonConfirm
        icon="delete"
        openSize="small"
        openColor="error"
        openLabel="Eliminar"
        openVariant="outline"
        confirmColor="error"
        confirmLabel="Eliminar"
        text="Esta orden se eliminara de forma permanente"
        handleConfirm={async () => {
          handleDelete()
        }}
      ></ButtonConfirm>
    ),
    canCancel && (
      <ButtonConfirm
        openLabel="Cancelar"
        modalTitle="Cancelar orden"
        openVariant="outline"
        openColor="info"
        openSize="small"
        icon="cancel"
        text={
          'Cancelar orden. Si necesitas retomarla en cualquer momento debes tener permiso para autorizar ordenes o pidele a tu administrador que lo haga.  '
        }
        confirmLabel="Cancelar orden"
        confirmVariant="outline"
        confirmColor="info"
        handleConfirm={async () => {
          return await handleCancel()
        }}
      />
    ),
    canCopy && <ButtonCopyRow orderId={orderId} />
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

export default OrderCommonActions
