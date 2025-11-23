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
            content: (
              <>
                <ListStaff
                  staff={staffSection}
                  sectionId={section.id}
                  hideSearchAndFilters
                  // handleSubtract={(staffId) => {
                  //   handleRemoveStaff(staffId)
                  // }}
                  handleEdit={(staffId) => {
                    //@ts-ignore
                    navigation.navigate('StackStaff', {
                      screen: 'ScreenStaffEdit',
                      params: { staffId }
                    })
                  }}
                />
              </>
            ),
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
