import { View } from 'react-native'
import ModalWhatsAppOrderStatus from './ModalWhatsAppOrderStatus'
import ModalAssignOrder from './ModalAssignOrder'
import Button from '../Button'
import { onAuthorize, onCancel, onDelete } from '../../libs/order-actions'
import ButtonConfirm from '../ButtonConfirm'

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
  const canCancel = actionsAllowed.canCancel
  const canEdit = actionsAllowed.canEdit
  const canDelete = actionsAllowed.canDelete
  const canSendWS = actionsAllowed.canSendWS
  const canAuthorize = actionsAllowed.canAuthorize
  const canReorder = actionsAllowed.canReorder
  const canAssign = actionsAllowed.canAssign

  const canRenew = actionsAllowed.canRenew

  const handleReorder = () => {
    console.log('Reorder')
  }
  const handleEdit = () => {
    console.log('Edit')
  }
  const buttons = [
    canAuthorize && (
      <Button
        label="Autorizar"
        onPress={() => {
          onAuthorize({ orderId, userId })
        }}
      />
    ),
    canReorder && (
      <Button
        label="Reordenar"
        onPress={() => {
          handleReorder()
        }}
      />
    ),

    canSendWS && <ModalWhatsAppOrderStatus orderId={orderId} />,
    canCancel && (
      <ButtonConfirm
        text={'Cancelar orden'}
        handleConfirm={async () => {
          return await onCancel({ orderId, userId })
        }}
      />
    ),
    canAssign && <ModalAssignOrder orderId={orderId} />
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
        text="Esta orden se eliminara de forma permanente"
        handleConfirm={async () => {
          onDelete({ orderId })
        }}
      ></ButtonConfirm>
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
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          padding: 2
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
