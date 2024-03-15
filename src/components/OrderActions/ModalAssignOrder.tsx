import { useEffect, useState } from 'react'
import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import asDate from '../../libs/utils-date'
import Button from '../Button'
import WeekTimeline, { Event } from '../Calendars/WeekTimeline2'
import InputSelect from '../InputSelect'
import StyledModal from '../StyledModal'

const ModalAssignOrder = ({
  assignedToSection,
  assignToSection,
  assignToStaff,
  assignedToStaff,
  assignToDate,
  assignedToDate
}: {
  assignedToSection: string
  assignToSection: (sectionId: string) => void
  assignedToStaff?: string
  assignToStaff?: (sectionId: string) => void
  assignedToDate?: Date
  assignToDate?: (date: Date) => void
}) => {
  const modal = useModal({ title: 'Asignar a' })
  const { storeSections } = useStore()
  const sectionAssigned = storeSections.find(
    (o) => o?.id === assignedToSection
  )?.name

  const [sectionEvents, setSectionEvents] = useState<Event[]>([])

  // useEffect(() => {}, [])
  // console.log({ assignedToSection })
  return (
    <>
      <Button onPress={modal.toggleOpen}>
        {sectionAssigned ? `Asignada a ${sectionAssigned}` : 'Asignar'}
      </Button>
      <StyledModal {...modal}>
        <InputSelect
          selectedValue={assignedToSection}
          onChangeValue={(sectionId) => {
            assignToSection(sectionId)
          }}
          options={storeSections.map(({ name, id }) => ({
            label: name,
            value: id
          }))}
        />
        <WeekTimeline
          events={sectionEvents}
          numberOfDays={4}
          dateSelected={asDate(assignedToDate)}
          onSelectDate={(date) => {
            assignToDate?.(date)
          }}
        />
      </StyledModal>
    </>
  )
}
export default ModalAssignOrder
