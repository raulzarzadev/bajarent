import { useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import StyledModal from '../StyledModal'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import { View } from 'react-native'
import FormikAssignOrder from '../FormikAssignOrder'
import { Formik } from 'formik'
import { onComment } from '../../libs/order-actions'
import InputAssignSection from '../InputAssingSection'

const ModalAssignOrder = ({
  orderId = null,

  section,
  date
}: {
  orderId: string | null

  section?: string
  date?: Date
}) => {
  const { storeSections, storeId } = useStore()

  const [loading, setLoading] = useState(false)
  const handleAssignSection = async (sectionId: any) => {
    const newSectionName =
      storeSections?.find((s) => s.id === sectionId)?.name || ''
    setLoading(true)
    try {
      ServiceOrders.update(orderId, {
        assignToSection: sectionId,
        assignToSectionName: newSectionName
      })
      onComment({
        orderId,
        content: `Asignada a ${newSectionName}`,
        type: 'comment',
        storeId,
        isOrderMovement: true
      })
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
        setNewSection={(sectionId) => handleAssignSection(sectionId)}
        disabled={loading}
      />
    </View>
  )
}
export default ModalAssignOrder
