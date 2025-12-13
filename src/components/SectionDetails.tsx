import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import { ServiceSections } from '../firebase/ServiceSections'
import useMyNav from '../hooks/useMyNav'
import { useShop } from '../hooks/useShop'
import type { SectionType } from '../types/SectionType'
import Button from './Button'
import ButtonConfirm from './ButtonConfirm'
import ErrorBoundary from './ErrorBoundary'
import ListStaff from './ListStaff2'

const SectionDetails = ({ section }: { section: SectionType }) => {
  const navigation = useNavigation()
  const { toSections } = useMyNav()
  const { shop } = useShop()
  const {
    permissions: { canEditStaff }
  } = useEmployee()

  const shopStaff = shop?.staff || []
  const sectionStaff = section.staff

  const staffSection = shopStaff.filter((s) => sectionStaff.includes(s.id))

  console.log({ shopStaff, sectionStaff })

  const canEditSection = canEditStaff

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 'auto',
          gap: 16
        }}
      >
        <ButtonConfirm
          //  justIcon
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
                navigation.goBack()
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

      <ListStaff staff={staffSection} hideSearchAndFilters />

      {/* <Tabs
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
      /> */}
    </View>
  )
}

export default SectionDetails

export const SectionDetailsE = (props) => (
  <ErrorBoundary componentName="SectionDetails">
    <SectionDetails {...props} />
  </ErrorBoundary>
)

// export const AddStaffToThisSection = ({ sectionId }: { sectionId: string }) => {
//   const { shop } = useShop()
//   const {
//     permissions: { canEditStaff }
//   } = useEmployee()
//   const shopStaff = shop?.staff || []
//   const staffInSection = shopStaff.filter((s) =>
//     s.sectionsAssigned?.includes(sectionId)
//   )

//   const [staffAdded, setStaffAdded] = useState<string[]>([])
//   const [loading, setLoading] = useState(false)

//   const handleConfirmAddStaffToSection = async (
//     sectionId: string,
//     staffIds: string[]
//   ) => {
//     setLoading(true)
//     // return await ServiceSections.addStaffToSection(sectionId, staffIds)
//     //TODO: this functions should edit each staff with the section that is added naw
//     //? Is this the best approach?
//     //? or should we keep this logic in each sections?
//     //! NOTE: the chosen approach is to update each staff member with the new section. This ensures that staff members are aware of
//     //! their assigned sections, which is crucial for their roles and responsibilities within the store.
//     //*DONE: Its solved, we take this approach, use assignedSections in each staff as the truth but needs to be tested
//     const [err, res] = await catchError(
//       ServiceStores.setStaffToSection({
//         storeId: shop.id,
//         sectionId,
//         staffIds
//       })
//     )
//     if (err) {
//       console.error({ err })
//     }
//     setLoading(false)
//     return { err, res }
//   }

//   const isDirty =
//     staffAdded.length !== staffInSection.length ||
//     staffAdded.some((id) => !staffInSection.find((s) => s.id === id))

//   const modal = useModal({ title: 'Agregar staff a sección' })
//   console.log({ shopStaff, staffInSection, sectionId })
//   return (
//     <View style={[{ marginVertical: 14, marginHorizontal: 'auto' }]}>
//       <Button
//         label="Agregar staff "
//         icon="profileAdd"
//         onPress={() => {
//           modal.toggleOpen()
//         }}
//         disabled={!canEditStaff}
//         size="small"
//       ></Button>
//       <StyledModal {...modal}>
//         <ListStaff
//           // staff={staff}
//           //* Here should show only staff not in section
//           //* the problem is that we need to be able to add and remove staff from section
//           //* What is the easiest way to do this for the user?
//           //* option 1: show two lists, one for staff in section and one for staff not in section
//           //* option 2: show one list with checkboxes to select/deselect staff
//           //staff={staff.filter((s) => !staffAdded.includes(s.id))}
//           //DONE: show one list with staff not in section and move remove staff to another list
//           staff={shopStaff.filter(
//             (shopEmployee) =>
//               !staffInSection.find((s) => s.id === shopEmployee.id)
//           )}
//           // handleAdd={async (staffId: string) => {
//           //   setStaffAdded((prev) => [...prev, staffId])
//           // }}
//         />
//       </StyledModal>
//       <ListStaff staff={staffInSection} hideSearchAndFilters />

//       <Button
//         disabled={!isDirty || loading}
//         label="Guardar cambios"
//         icon="save"
//         onPress={() => {
//           handleConfirmAddStaffToSection(sectionId, staffAdded)
//         }}
//       ></Button>
//     </View>
//   )
// }
