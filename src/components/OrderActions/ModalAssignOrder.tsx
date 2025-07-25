import { useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import { onAssignOrder, onComment } from '../../libs/order-actions'
import InputAssignSection from '../InputAssingSection'
import { useCurrentWork } from '../../state/features/currentWork/currentWorkSlice'

const ModalAssignOrder = ({
  orderId = null,
  section
}: {
  orderId: string | null

  section?: string
}) => {
  const { storeId } = useStore()
  const { addWork } = useCurrentWork()
  const [loading, setLoading] = useState(false)
  const handleAssignSection = async ({ sectionId, sectionName }) => {
    setLoading(true)
    try {
      await onAssignOrder({ orderId, storeId, sectionId, sectionName })
      addWork({
        work: {
          action: 'order_reassigned',
          type: 'order',
          details: {
            sectionId,
            orderId
          }
        }
      })
    } catch (e) {
      console.error({ e })
    } finally {
      setLoading(false)
    }
  }

  return (
    <InputAssignSection
      currentSection={section}
      setNewSection={({ sectionId, sectionName }) =>
        handleAssignSection({ sectionId, sectionName })
      }
      disabled={loading}
    />
  )
}
export default ModalAssignOrder
