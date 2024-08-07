import { useState } from 'react'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import StyledModal from '../StyledModal'
import { View } from 'react-native'
import InputTextStyled from '../InputTextStyled'
import InputCount from '../InputCount'
import { onComment, onExtend, onExtend_V2 } from '../../libs/order-actions'
import InputRadios from '../InputRadios'
import { TimeType } from '../../types/PriceType'
import { translateTime } from '../../libs/expireDate'
import { ServiceOrders } from '../../firebase/ServiceOrders'

const AddExtendExpire = ({
  orderId,
  storeId
}: {
  orderId: string
  storeId: string
}) => {
  const modal = useModal({ title: 'Extender fecha de entrega' })
  const [count, setCount] = useState(0)
  const [reason, setReason] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [unit, setUnit] = useState<TimeType>('day')

  const handleExtend = async () => {
    setDisabled(true)
    const order = await ServiceOrders.get(orderId)
    await onExtend_V2({
      items: order.items,
      orderId: order.id,
      startAt: order.expireAt,
      time: `${count} ${unit}`,
      reason: 'extension'
    })
      .then(console.log)
      .catch(console.error)
    await onComment({
      orderId,
      storeId,
      content: `Extendio por ${translateTime(
        `${count} ${unit}`
      )}. Motivo: ${reason}`,
      type: 'comment'
    })
      .then(console.log)
      .catch(console.error)
    setDisabled(false)
    modal.toggleOpen()
  }

  const timeOptions: { label: string; value: TimeType }[] = [
    {
      label: 'Hora',
      value: 'hour'
    },
    {
      label: 'Días',
      value: 'day'
    },
    {
      label: 'Semanas',
      value: 'week'
    },
    {
      label: 'Meses',
      value: 'month'
    }
  ]

  return (
    <View>
      <Button
        disabled={disabled}
        label="Extender"
        onPress={modal.toggleOpen}
        size="small"
        icon="calendarTime"
      />
      <StyledModal {...modal}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ marginVertical: 8 }}>
            <View style={{ marginVertical: 8 }}>
              <InputRadios
                layout="row"
                options={timeOptions}
                setValue={(value) => setUnit(value as TimeType)}
                value={unit}
              />
            </View>
            <View style={{ marginVertical: 8 }}>
              <InputCount setValue={setCount} value={count} />
            </View>
            <InputTextStyled
              placeholder="Motivo"
              onChangeText={setReason}
              value={reason}
            />
          </View>
          <View style={{ marginVertical: 8 }}>
            <Button
              disabled={disabled}
              label="Extender"
              onPress={() => {
                handleExtend()
              }}
            />
          </View>
        </View>
      </StyledModal>
    </View>
  )
}

export default AddExtendExpire
