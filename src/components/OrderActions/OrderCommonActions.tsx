import { View } from 'react-native'
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
    return await onCancel({ orderId, userId }).then(() => {
      onOrderComment({ content: 'Cancelada' })
    })
  }

  const handleUpdateStatuses = async () => {
    onSetStatuses({ orderId })
  }

  const buttons = [
    canAssign && <ModalScheduleOrder orderId={orderId} />,
    canAssign && (
      <ModalAssignOrder orderId={orderId} section={order?.assignToSection} />
    ),
    canExtend && <AddExtendExpire orderId={orderId} storeId={storeId} />,
    canSendWS && <ModalSendWhatsappE orderId={orderId} />,
    // true && <ModalAssignItem orderId={orderId} />,

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
    canDelete && <ButtonDeleteOrder orderId={orderId} />,
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
// const ModalAssignItem = ({ orderId, itemId }) => {
//   const modal = useModal({ title: 'Asignar item' })
//   const { storeId, items } = useStore()
//   const [itemSelected, setItemSelected] = useState<null | string>(null)
//   const [loading, setLoading] = useState(false)
//   const handleAssignItem = async () => {
//     setLoading(true)
//     await onAssignItem({
//       orderId,
//       newItemId: itemSelected,
//       storeId,
//       newItemNumber: items?.find((i) => i?.id === itemId).number,
//       oldItemId: itemId
//     })
//       .then((res) => console.log({ res }))
//       .catch((err) => console.log({ err }))
//     setLoading(false)
//   }
//   const alreadyHasItem = item
//   return (
//     <View>
//       <Button
//         label="Asignar item"
//         onPress={() => {
//           modal.toggleOpen()
//         }}
//         size="small"
//       />
//       <StyledModal {...modal}>
//         <ListAssignedItemsE
//           itemSelected={itemSelected}
//           onSelectItem={(itemId) => {
//             setItemSelected(itemId)
//           }}
//         />
//         <View>
//           <Button
//             disabled={alreadyHasItem}
//             label="Asignar"
//             onPress={() => {
//               handleAssignItem()
//             }}
//           ></Button>
//         </View>
//       </StyledModal>
//     </View>
//   )
// }

export const OrderCommonActionsE = (props: OrderCommonActionsType) => (
  <ErrorBoundary componentName="OrderCommonActions">
    <OrderCommonActions {...props} />
  </ErrorBoundary>
)
export default OrderCommonActions
