import { useEffect, useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import InputSelect from '../InputSelect'
import StyledModal from '../StyledModal'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import WeekOrdersTimeLine from '../WeekOrdersTimeLine'
import OrderType from '../../types/OrderType'
import { View } from 'react-native'
import FormikAssignOrder from '../FormikAssignOrder'
import { Formik } from 'formik'

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
  const { store, storeSections } = useStore()
  console.log({ section })
  const assignedToSectionName = storeSections?.find(
    (s) => s.id === section
  )?.name
  console.log({ assignedToSectionName })
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await ServiceOrders.update(orderId, values)
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
