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
  const { storeSections, orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const assignedToSection = order?.assignToSection
  const assignedDate = order?.scheduledAt
  const modal = useModal({ title: 'Asignar a' })

  // const [sectionEvents, setSectionEvents] = useState<Event[]>([])

  // const handleChangeAssignSection = (sectionId: string) => {
  //   assignSection?.(sectionId)
  //   if (orderId) ServiceOrders.update(orderId, { assignToSection: sectionId })
  // }

  //const [sectionOrders, setSectionOrders] = useState<OrderType[]>([])

  // const handleChangeAssignDate = (date: Date) => {
  //   assignDate?.(date)
  //   if (orderId) ServiceOrders.update(orderId, { scheduledAt: date })
  // }

  // useEffect(() => {
  //   if (assignedToSection) {
  //     const sectionOrders = orders.filter(
  //       (o) => o.assignToSection === assignedToSection
  //     )
  //     setSectionOrders(sectionOrders)
  //   }
  // }, [assignedToSection, orders])
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
      <Button onPress={modal.toggleOpen} label="Asignar" size="small"></Button>
      <StyledModal {...modal}>
        <Formik
          initialValues={{
            scheduledAt: order?.scheduledAt,
            assignToSection: order?.assignToSection
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
        {/* <InputSelect
          value={assignedToSection}
          onChangeValue={(sectionId) => {
            if (sectionId !== assignedToSection)
              handleChangeAssignSection(sectionId)
          }}
          options={storeSections.map(({ name, id }) => ({
            label: name,
            value: id
          }))}
        />
        <WeekOrdersTimeLine
          orders={sectionOrders}
          assignedDate={assignedDate}
          onSelectDate={(date) => {
            handleChangeAssignDate?.(date)
          }}
        /> */}
      </StyledModal>
    </View>
  )
}
export default ModalAssignOrder
