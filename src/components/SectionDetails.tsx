import { StyleSheet, Text, View } from 'react-native'
import { SectionType } from '../types/SectionType'
import { useStore } from '../contexts/storeContext'
import { ServiceSections } from '../firebase/ServiceSections'
import ListStaff from './ListStaff2'
import ButtonIcon from './ButtonIcon'
import { useNavigation } from '@react-navigation/native'
import ButtonConfirm from './ButtonConfirm'
import Tabs from './Tabs'
import ErrorBoundary from './ErrorBoundary'
import { useEmployee } from '../contexts/employeeContext'
import ListStoreItems from './ListStoreItems'
import useMyNav from '../hooks/useMyNav'
import useModal from '../hooks/useModal'
import { useShop } from '../hooks/useShop'
import { useEffect, useState } from 'react'
import { ServiceStores } from '../firebase/ServiceStore'
import catchError from '../libs/catchError'
import { gStyles } from '../styles'
import Button from './Button'
import StyledModal from './StyledModal'

const SectionDetails = ({ section }: { section: SectionType }) => {
  const { staff } = useStore()
  const { toSections } = useMyNav()
  const navigation = useNavigation()
  const {
    permissions: { canEditStaff }
  } = useEmployee()

  const staffSection = section?.staff?.map((staffId) =>
    staff?.find((s) => s?.id === staffId)
  )

  const canEditSection = canEditStaff

  const defaultArea = !!section?.defaultArea

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 'auto'
        }}
      >
        {!defaultArea && (
          <ButtonConfirm
            justIcon
            icon="delete"
            openVariant="ghost"
            openColor="error"
            // openLabel='Eliminar'
            confirmColor="error"
            confirmLabel="Eliminar"
            modalTitle="Eliminar Area"
            handleConfirm={async () => {
              return await ServiceSections.delete(section.id)
                .then(() => {
                  navigation.goBack()
                })
                .catch((e) => console.log(e))
            }}
            openDisabled={!canEditSection}
            text={`¿Desea eliminar esta area?`}
          />
        )}

        <Text style={[styles?.title]}>{section?.name} </Text>
        {!defaultArea && (
          <ButtonIcon
            variant="ghost"
            icon="edit"
            color="secondary"
            onPress={() => {
              toSections({ id: section.id, screenEdit: true })
            }}
            disabled={!canEditSection}
          ></ButtonIcon>
        )}
      </View>

      <Tabs
        tabId="section-details"
        tabs={[
          {
            title: 'Staff',
            content: <AddStaffToThisSection sectionId={section.id} />,
            show: true
          },
          {
            title: 'Artículos',
            content: <ListStoreItems allItemsSections={[section.id]} />,
            show: true
          }
        ]}
      />
    </View>
  )
}

export default SectionDetails

export const SectionDetailsE = (props) => (
  <ErrorBoundary componentName="SectionDetails">
    <SectionDetails {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    alignItems: 'center',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    alignItems: 'center',
    textAlign: 'center'
  }
})

export const AddStaffToThisSection = ({ sectionId }: { sectionId: string }) => {
  const { shop } = useShop()
  const staff = shop?.staff || []
  const {
    permissions: { canEditStaff }
  } = useEmployee()
  const staffInSection = staff.filter((s) =>
    s.sectionsAssigned?.includes(sectionId)
  )

  const [staffAdded, setStaffAdded] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setStaffAdded(staffInSection.map((s) => s.id))
  }, [sectionId])
  const handleConfirmAddStaffToSection = async (
    sectionId: string,
    staffIds: string[]
  ) => {
    setLoading(true)
    // return await ServiceSections.addStaffToSection(sectionId, staffIds)
    //TODO: this functions should edit each staff with the section that is added naw
    //? Is this the best approach?
    //? or should we keep this logic in each sections?
    //! NOTE: the chosen approach is to update each staff member with the new section. This ensures that staff members are aware of
    //! their assigned sections, which is crucial for their roles and responsibilities within the store.
    //*DONE: Its solved, we take this approach, use assignedSections in each staff as the truth but needs to be tested
    const [err, res] = await catchError(
      ServiceStores.setStaffToSection({
        storeId: shop.id,
        sectionId,
        staffIds
      })
    )
    if (err) {
      console.error({ err })
    }
    setLoading(false)
    return { err, res }
  }

  const isDirty =
    staffAdded.length !== staffInSection.length ||
    staffAdded.some((id) => !staffInSection.find((s) => s.id === id))
  const modal = useModal({ title: 'Agregar staff a sección' })

  return (
    <View
      style={[
        { marginVertical: 14, marginHorizontal: 'auto' },
        gStyles.container
      ]}
    >
      <Button
        label="Agregar staff "
        icon="profileAdd"
        onPress={() => {
          modal.toggleOpen()
        }}
        disabled={!canEditStaff}
        size="small"
      ></Button>
      <StyledModal {...modal}>
        <ListStaff
          // staff={staff}
          //* Here should show only staff not in section
          //* the problem is that we need to be able to add and remove staff from section
          //* What is the easiest way to do this for the user?
          //* option 1: show two lists, one for staff in section and one for staff not in section
          //* option 2: show one list with checkboxes to select/deselect staff
          //staff={staff.filter((s) => !staffAdded.includes(s.id))}
          //DONE: show one list with staff not in section and move remove staff to another list
          staff={staff.filter((s) => !staffAdded.includes(s.id))}
          handleAdd={async (staffId: string) => {
            setStaffAdded((prev) => [...prev, staffId])
          }}
        />
      </StyledModal>
      <ListStaff
        staff={staff.filter((s) => staffAdded.includes(s.id))}
        handleSubtract={async (staffId) => {
          setStaffAdded((prev) => prev.filter((id) => id !== staffId))
        }}
        hideSearchAndFilters
      />

      <Button
        disabled={!isDirty || loading}
        label="Guardar cambios"
        icon="save"
        onPress={() => {
          handleConfirmAddStaffToSection(sectionId, staffAdded)
        }}
      ></Button>
    </View>
  )
}
