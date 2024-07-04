import { View } from 'react-native'
import InputDate from '../InputDate'
import { useOrderCtx } from '../../contexts/orderContext'
import asDate from '../../libs/utils-date'
import { ServiceOrders } from '../../firebase/ServiceOrders'

const ModalScheduleOrder = ({ orderId = null }: { orderId: string | null }) => {
  const handleSubmit = async (date: any) => {
    try {
      await ServiceOrders.update(orderId, { scheduledAt: date })
    } catch (e) {
      console.error({ e })
    }
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
