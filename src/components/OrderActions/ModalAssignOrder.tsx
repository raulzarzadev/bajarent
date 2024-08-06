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

const ModalAssignOrder = ({
  orderId = null,
  assignDate,
  assignSection,
  section,
  date
}: {
  orderId: string | null
  assignDate?: (value: Date | null) => void
  assignSection?: (value: string | null) => void
  section?: string
  date?: Date
}) => {
  const modal = useModal({ title: 'Asignar a' })
  const { storeSections, storeId } = useStore()
  const assignedToSectionName = storeSections?.find(
    (s) => s.id === section
  )?.name
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (values: any) => {
    const newSectionName = storeSections?.find(
      (s) => s.id === values.assignToSection
    )?.name
    setLoading(true)
    try {
      ServiceOrders.update(orderId, values)
      onComment({
        orderId,
        content: `Asignada a ${newSectionName}`,
        type: 'comment',
        storeId
      })
      modal.toggleOpen()
    } catch (e) {
      console.error({ e })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View>
      <Button
        onPress={modal.toggleOpen}
        label={`${assignedToSectionName || 'Asignar'}`}
        size="small"
        icon="swap"
      ></Button>
      <StyledModal {...modal}>
        <Formik
          initialValues={{
            scheduledAt: date || new Date(),
            assignToSection: section || null
          }}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <View>
              <FormikAssignOrder />
              <Button
                disabled={loading}
                onPress={handleSubmit}
                label="Asignar"
              ></Button>
            </View>
          )}
        </Formik>
      </StyledModal>
    </View>
  )
}
export default ModalAssignOrder
