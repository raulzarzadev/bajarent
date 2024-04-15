import { View } from 'react-native'
import ModalWhatsAppOrderStatus from './ModalWhatsAppOrderStatus'
import ModalAssignOrder from './ModalAssignOrder'
import Button from '../Button'
import { onAuthorize, onCancel, onDelete } from '../../libs/order-actions'
import ButtonConfirm from '../ButtonConfirm'
import { useNavigation } from '@react-navigation/native'

const OrderCommonActions = ({
  actionsAllowed,
  orderId,
  userId
}: {
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
  }
  userId: string
}) => {
  const { navigate } = useNavigation()
  const canCancel = actionsAllowed.canCancel
  const canEdit = actionsAllowed.canEdit
  const canDelete = actionsAllowed.canDelete
  const canSendWS = actionsAllowed.canSendWS
  const canAuthorize = actionsAllowed.canAuthorize
  const canReorder = actionsAllowed.canReorder
  const canAssign = actionsAllowed.canAssign

  const canRenew = actionsAllowed.canRenew

  const handleReorder = () => {
    // @ts-ignore
    navigate('ReorderOrder', { orderId })
  }
  const handleEdit = () => {
    // @ts-ignore
    navigate('EditOrder', { orderId })
  }
  const handleRenew = () => {
    // @ts-ignore
    navigate('RenewOrder', { orderId })
  }
  const handleDelete = () => {
    onDelete({ orderId })
  }
  const handleAuthorize = () => {
    onAuthorize({ orderId, userId })
  }
  const handleCancel = async () => {
    return await onCancel({ orderId, userId })
  }

  const buttons = [
    canSendWS && <ModalWhatsAppOrderStatus orderId={orderId} />,

    canAssign && <ModalAssignOrder orderId={orderId} />,
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
        openVariant="outline"
        openColor="info"
        confirmColor="info"
        openSize="small"
        icon="cancel"
        text={'Cancelar orden'}
        handleConfirm={async () => {
          return await handleCancel()
        }}
      />
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

export default OrderCommonActions
