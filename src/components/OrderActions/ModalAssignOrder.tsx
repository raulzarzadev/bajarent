import { useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { View } from 'react-native'
import { onAssignOrder, onComment } from '../../libs/order-actions'
import InputAssignSection from '../InputAssingSection'

const ModalAssignOrder = ({
  orderId = null,
  section
}: {
  orderId: string | null

  section?: string
}) => {
  const { storeId } = useStore()

  const [loading, setLoading] = useState(false)
  const handleAssignSection = async ({ sectionId, sectionName }) => {
    setLoading(true)
    try {
      await onAssignOrder({ orderId, storeId, sectionId, sectionName })
    } catch (e) {
      console.error({ e })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View>
      <InputAssignSection
        currentSection={section}
        setNewSection={({ sectionId, sectionName }) =>
          handleAssignSection({ sectionId, sectionName })
        }
        disabled={loading}
      />
    </View>
  )
}
export default ModalAssignOrder
