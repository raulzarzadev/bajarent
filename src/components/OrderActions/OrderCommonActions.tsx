import Button from 'components/Button'
import { onAuthorize, onCancel, onDelete } from 'libs/order-actions'
import ModalWhatsAppOrderStatus from './ModalWhatsAppOrderStatus'
import ModalAssignOrder from './ModalAssignOrder'
import ButtonConfirm from 'components/ButtonConfirm'
import { View } from 'react-native'
import { useAuth } from 'contexts/authContext'

const OrderCommonActions = ({
  orderId
}: {
  orderId: string
  permissions: {
    canRenew?: boolean
    canCancel?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canSendWS?: boolean
    canAuthorize?: boolean
  }
}) => {
  const { user } = useAuth()
  const userId = user?.id
  const userOrderPermissions = user?.permissions?.orders
  const userCanAuthorize = !!userOrderPermissions?.canAuthorize
  const canReorder = !!userOrderPermissions?.canReorder
  const userCanCancel = !!userOrderPermissions?.canCancel
  const userCanEdit = !!userOrderPermissions?.canEdit
  const userCanDelete = !!userOrderPermissions?.canDelete
  const userCanSendWS = !!userOrderPermissions?.canSentWS
  const userCanAssign = !!userOrderPermissions?.canAssign
  // const userCanRenew = !!userOrderPermissions?.canRenew

  const handleReorder = () => {
    console.log('Reorder')
  }
  const handleEdit = () => {
    console.log('Edit')
  }
  const buttons = [
    userCanAuthorize && (
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

    userCanSendWS && <ModalWhatsAppOrderStatus orderId={orderId} />,
    userCanCancel && (
      <ButtonConfirm
        text={'Cancelar orden'}
        handleConfirm={async () => {
          return await onCancel({ orderId, userId })
        }}
      />
    ),
    userCanAssign && <ModalAssignOrder orderId={orderId} />
  ]
  const buttons2 = [
    userCanEdit && (
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
    userCanDelete && (
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
