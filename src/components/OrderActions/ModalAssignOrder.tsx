import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import ListSections from '../ListSections'
import StyledModal from '../StyledModal'

const ModalAssignOrder = ({
  assignedToSection,
  assignToSection
}: {
  assignedToSection: string
  assignToSection: (sectionId: string) => void
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
        <ListSections
          sections={storeSections}
          onPress={(sectionId) => {
            assignToSection(sectionId)
            modal.toggleOpen()
          }}
        ></ListSections>
        {/* <ListStaff
          staff={staff}
          onPress={(staffId) => {
            ServiceOrders.update(orderId, { assignTo: staffId })
              .then(() => {
                modal.toggleOpen()
              })
              .catch(console.error)
          }}
        ></ListStaff> */}
      </StyledModal>
    </>
  )
}
export default ModalAssignOrder
