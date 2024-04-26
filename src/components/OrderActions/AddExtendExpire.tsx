import { useState } from 'react'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import StyledModal from '../StyledModal'
import { View } from 'react-native'
import InputTextStyled from '../InputTextStyled'
import InputCount from '../InputCount'
import { onComment, onExtend } from '../../libs/order-actions'
import InputRadios from '../InputRadios'
import { TimeType } from '../../types/PriceType'
import { translateTime } from '../../libs/expireDate'

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
    try {
      await onExtend(orderId, { time: `${count} ${unit}`, reason })
      await onComment({
        orderId,
        storeId,
        content: `Extendio por ${translateTime(
          `${count} ${unit}`
        )}. Motivo: ${reason}`,
        type: 'comment'
      }).catch(console.error)
      setDisabled(false)
      modal.toggleOpen()
    } catch (error) {
      setDisabled(false)
      console.log(error)
    }
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
    }
  ]

  return (
    <View>
      <Button
        disabled={disabled}
        label="Extender"
        onPress={modal.toggleOpen}
        size="small"
        icon="calendar"
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
