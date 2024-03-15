import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import WeekTimeline from '../Calendars/WeekTimeline2'
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
  assignedToStaff?: string
  assignToSection: (sectionId: string) => void
  assignToStaff?: (sectionId: string) => void
  assignToDate?: (date: Date) => void
  assignedToDate?: Date
}) => {
  const modal = useModal({ title: 'Asignar a' })
  const { storeSections } = useStore()
  const sectionAssigned = storeSections.find(
    (o) => o?.id === assignedToSection
  )?.name

  return (
    <>
      <Button onPress={modal.toggleOpen}>
        {sectionAssigned ? `Asignada a ${sectionAssigned}` : 'Asignar'}
      </Button>
      <StyledModal {...modal}>
        <InputSelect
          onChangeValue={(sectionId) => {
            assignToSection(sectionId)
          }}
          options={storeSections.map(({ name, id }) => ({
            label: name,
            value: id
          }))}
        />
        <WeekTimeline
          numberOfDays={4}
          dateSelected={assignedToDate}
          onSelectDate={(date) => {
            assignToDate?.(date)
          }}
        />
        {/* <Text style={gStyles.h3}>Staff</Text>
        <ListStaff
          staffSelected={[assignedToStaff]}
          staff={staff}
          onPress={(staffId) => {
            if (assignedToStaff === staffId) {
              assignToStaff?.('')
            } else {
              assignToStaff?.(staffId)
              modal.toggleOpen()
            }
          }}
        ></ListStaff> */}
      </StyledModal>
    </>
  )
}
export default ModalAssignOrder
