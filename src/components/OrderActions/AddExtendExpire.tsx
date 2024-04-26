import { useState } from 'react'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import StyledModal from '../StyledModal'
import { View } from 'react-native'
import InputTextStyled from '../InputTextStyled'
import InputCount from '../InputCount'
import { onComment, onExtend } from '../../libs/order-actions'

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
  const handleExtend = async () => {
    setDisabled(true)
    try {
      await onExtend(orderId, { time: `${count} day`, reason })
      await onComment({
        orderId,
        storeId,
        content: `Extedio por ${count} días. Motivo: ${reason}`,
        type: 'comment'
      }).catch(console.error)
      console.log('extended')
      setDisabled(false)
      modal.toggleOpen()
    } catch (error) {
      setDisabled(false)
      console.log(error)
    }
  }

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
            <InputTextStyled
              placeholder="Motivo"
              onChangeText={setReason}
              value={reason}
            />
          </View>
          <View style={{ marginVertical: 8 }}>
            <InputCount label="Días" setValue={setCount} value={count} />
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
