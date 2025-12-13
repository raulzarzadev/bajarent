import { useNavigation } from '@react-navigation/native'
import { Text, View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { ServiceSections } from '../firebase/ServiceSections'
import { useShop } from '../hooks/useShop'
import type { SectionType } from '../types/SectionType'
import Button from './Button'
import ButtonConfirm from './ButtonConfirm'
import ErrorBoundary from './ErrorBoundary'
import ListStaff from './ListStaff2'
import useMyNav from '../hooks/useMyNav'
import { gStyles } from '../styles'

const SectionDetails = ({ section }: { section: SectionType }) => {
  const { goBack } = useNavigation()
  const { toSections } = useMyNav()
  const { shop } = useShop()
  const {
    permissions: { canEditStaff }
  } = useEmployee()

  const canEditSection = canEditStaff

  const sectionStaff =
    shop?.staff.filter((s) => s.sectionsAssigned?.includes(section.id)) || []
  return (
    <View>
      <Text style={gStyles.h3}> {section.name}</Text>
      <Text style={[gStyles.p, gStyles.tCenter]}>{section.description}</Text>
      <Text style={[gStyles.p, gStyles.tCenter]}>
        Empleados: <Text style={gStyles.tBold}>{sectionStaff.length}</Text>
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 'auto',
          gap: 16
        }}
      >
        <ButtonConfirm
          icon="delete"
          openVariant="ghost"
          openColor="error"
          openLabel="Eliminar"
          confirmColor="error"
          confirmLabel="Eliminar"
          modalTitle="Eliminar Area"
          handleConfirm={async () => {
            return await ServiceSections.delete(section.id)
              .then(() => {
                goBack()
              })
              .catch((e) => console.log(e))
          }}
          openDisabled={!canEditSection}
          text={`¿Desea eliminar esta area?`}
        />
        <Button
          variant="ghost"
          icon="edit"
          color="secondary"
          onPress={() => {
            toSections({ id: section.id, screenEdit: true })
          }}
          disabled={!canEditSection}
          label="Editar"
        ></Button>
      </View>

      <ListStaff staff={sectionStaff} hideSearchAndFilters shop={shop} />
    </View>
  )
}

export default SectionDetails

export const SectionDetailsE = (props) => (
  <ErrorBoundary componentName="SectionDetails">
    <SectionDetails {...props} />
  </ErrorBoundary>
)
