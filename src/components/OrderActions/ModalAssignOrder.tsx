import { useEffect, useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import asDate from '../../libs/utils-date'
import Button from '../Button'
import WeekTimeline, { Event } from '../Calendars/WeekTimeline2'
import InputSelect from '../InputSelect'
import StyledModal from '../StyledModal'
import { ServiceOrders } from '../../firebase/ServiceOrders'

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
  const assignedToSection = order?.assignToSection || section
  const assignedDate = order?.scheduledAt || date
  const modal = useModal({ title: 'Asignar si' })
  const sectionAssigned = storeSections.find(
    (o) => o?.id === assignedToSection
  )?.name

  const [sectionEvents, setSectionEvents] = useState<Event[]>([])

  const handleChangeAssignSection = (sectionId: string) => {
    ServiceOrders.update(orderId, { assignToSection: sectionId })
    assignSection?.(sectionId)
  }

  const handleChangeAssignDate = (date: Date) => {
    ServiceOrders.update(orderId, { scheduledAt: date })
    assignDate?.(date)
  }

  useEffect(() => {
    if (assignedToSection) {
      const sectionOrders = orders.filter(
        (o) => o.assignToSection === assignedToSection
      )
      setSectionEvents(
        sectionOrders.map((o) => ({
          date: o.scheduledAt,
          title: o.fullName,
          id: o.id
        }))
      )
    }
  }, [assignedToSection, orders])

  return (
    <>
      <Button onPress={modal.toggleOpen}>
        {sectionAssigned ? `Asignada a ${sectionAssigned}` : 'Asignar'}
      </Button>
      <StyledModal {...modal}>
        <InputSelect
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
        <WeekTimeline
          currentEventId={orderId}
          events={sectionEvents}
          numberOfDays={4}
          dateSelected={asDate(assignedDate)}
          onSelectDate={(date) => {
            handleChangeAssignDate?.(date)
          }}
        />
      </StyledModal>
    </>
  )
}
export default ModalAssignOrder
