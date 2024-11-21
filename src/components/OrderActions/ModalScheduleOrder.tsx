import { View } from 'react-native'
import InputDate from '../InputDate'
import { useOrderDetails } from '../../contexts/orderContext'
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
  const { order } = useOrderDetails()
  return (
    <View>
      <InputDate
        size="small"
        openButtonProps={{
          color: 'secondary',
          variant: 'filled'
        }}
        setValue={(d) => {
          handleSubmit(d)
        }}
        value={asDate(order?.scheduledAt) || new Date()}
      />
    </View>
  )
}
export default ModalScheduleOrder
