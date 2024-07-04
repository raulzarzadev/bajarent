import { useState } from 'react'
import useModal from '../../hooks/useModal'
import { View } from 'react-native'
import InputDate from '../InputDate'
import { useOrderCtx } from '../../contexts/orderContext'
import asDate from '../../libs/utils-date'

const ModalScheduleOrder = ({ orderId = null }: { orderId: string | null }) => {
  const handleSubmit = async (date: any) => {
    console.log({ date })
    // try {
    //   await ServiceOrders.update(orderId, { scheduledAt: date })
    //   modal.toggleOpen()
    // } catch (e) {
    //   console.error({ e })
    // } finally {
    //   setLoading(false)
    // }
  }
  const { order } = useOrderCtx()
  return (
    <View>
      <InputDate
        size="xs"
        setValue={(d) => {
          handleSubmit(d)
        }}
        value={asDate(order?.scheduledAt) || new Date()}
      />
    </View>
  )
}
export default ModalScheduleOrder
