import { View } from 'react-native'
import ModalAssignOrder from './ModalAssignOrder'
import Button from '../Button'
import { onCancel, onSetStatuses } from '../../libs/order-actions'
import ButtonConfirm from '../ButtonConfirm'
import { useNavigation } from '@react-navigation/native'
import AddExtendExpire from './AddExtendExpire'
import ButtonCopyRow from './ButtonCopyRow'
import ButtonDeleteOrder from './ButtonDeleteOrder'
import ModalScheduleOrder from './ModalScheduleOrder'
import { useOrderDetails } from '../../contexts/orderContext'
import ErrorBoundary from '../ErrorBoundary'
import InputTextStyled from '../InputTextStyled'
import { useState } from 'react'
import ButtonSetOrderLocation from './ButtonSetOrderLocation'
import TextInfo from '../TextInfo'
import { ButtonDownloadOrderE } from './ButtonDownloadOrder'

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

const CANCELED_REASON_MIN_LENGTH = 10

const OrderCommonActions = ({
  storeId,
  actionsAllowed,
  orderId,
  userId
}: OrderCommonActionsType) => {
  const { order } = useOrderDetails()
  const { navigate } = useNavigation()
  const [cancelledReason, setCancelledReason] = useState('')

  const canCancel = actionsAllowed?.canCancel
  const canEdit = actionsAllowed?.canEdit
  const canDelete = actionsAllowed?.canDelete
  const canReorder = actionsAllowed?.canReorder
  const canAssign = actionsAllowed?.canAssign
  const canExtend = actionsAllowed?.canExtend
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

  const handleCancel = async () => {
    return await onCancel({ orderId, userId, cancelledReason, storeId })
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
    // canSendWS && <ModalSendWhatsappE whatsappPhone={defaultWhatsappPhone} />,
    canReorder && (
      <Button
        variant="outline"
        label="Re-ordenar"
        onPress={() => {
          handleReorder()
        }}
        size="small"
        icon="refresh"
      />
    ),
    canCopy && <ButtonCopyRow orderId={orderId} />,
    <ButtonSetOrderLocation />
  ]
  const buttons2 = [
    canDelete && <ButtonDeleteOrder orderId={orderId} />,
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

    canCancel && (
      <ButtonConfirm
        openLabel="Cancelar"
        modalTitle="Cancelar orden"
        openVariant="outline"
        openColor="error"
        openSize="small"
        icon="cancel"
        confirmLabel="Cancelar orden"
        confirmVariant="outline"
        confirmColor="error"
        confirmDisabled={cancelledReason.length < CANCELED_REASON_MIN_LENGTH}
        handleConfirm={async () => {
          return await handleCancel()
        }}
      >
        <TextInfo
          defaultVisible
          text="Si necesitas retomarla más tarde. Pulsa Autorizar o pidele a tu admin que lo haga. "
        ></TextInfo>
        <View style={{ marginVertical: 8 }}>
          <InputTextStyled
            label="Motivo de cancelación"
            placeholder="Escribe el motivo de cancelación"
            onChangeText={(value) => {
              setCancelledReason(value)
            }}
            helperTextColor={
              cancelledReason.length < CANCELED_REASON_MIN_LENGTH
                ? 'error'
                : 'black'
            }
            helperText={`${
              cancelledReason.length < CANCELED_REASON_MIN_LENGTH
                ? 'Mínimo 10 caracteres'
                : ''
            }`}
            value={cancelledReason}
          />
        </View>
      </ButtonConfirm>
    ),
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
        <View style={{ padding: 4, width: '50%' }}>
          <ButtonDownloadOrderE order={order} />
        </View>
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
