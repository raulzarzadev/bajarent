import { Text } from 'react-native'
import { useStore } from '../../contexts/storeContext'
import useModal from '../../hooks/useModal'
import Button from '../Button'
import ListSections from '../ListSections'
import StyledModal from '../StyledModal'
import { gStyles } from '../../styles'
import ListStaff from '../ListStaff'

const ModalAssignOrder = ({
  assignedToSection,
  assignToSection,
  assignToStaff,
  assignedToStaff
}: {
  assignedToSection: string
  assignedToStaff?: string
  assignToSection: (sectionId: string) => void
  assignToStaff?: (sectionId: string) => void
}) => {
  const modal = useModal({ title: 'Asignar a' })
  const { storeSections, staff } = useStore()
  const sectionAssigned = storeSections.find(
    (o) => o?.id === assignedToSection
  )?.name

  return (
    <>
      <Button onPress={modal.toggleOpen}>
        {sectionAssigned ? `Asignada a ${sectionAssigned}` : 'Asignar'}
      </Button>
      <StyledModal {...modal}>
        <Text style={gStyles.h3}>Areas</Text>
        <ListSections
          sectionsSelected={[assignedToSection]}
          sections={storeSections}
          onPress={(sectionId) => {
            if (assignedToSection === sectionId) {
              assignToSection('')
            } else {
              modal.toggleOpen()
              assignToSection(sectionId)
            }
          }}
        ></ListSections>
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
