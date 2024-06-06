import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SectionType } from '../types/SectionType'

import { useStore } from '../contexts/storeContext'
import { ServiceSections } from '../firebase/ServiceSections'
import ListStaff from './ListStaff2'
import ButtonIcon from './ButtonIcon'
import { useNavigation } from '@react-navigation/native'
import ButtonConfirm from './ButtonConfirm'
import Tabs from './Tabs'
import ListOrders from './ListOrders'
import ErrorBoundary from './ErrorBoundary'
import TextInfo from './TextInfo'
import { useEmployee } from '../contexts/employeeContext'
import ListStoreItems from './ListStoreItems'

const SectionDetails = ({ section }: { section: SectionType }) => {
  const { staff, store } = useStore()
  const navigation = useNavigation()
  const {
    permissions: { canEditStaff }
  } = useEmployee()
  const handleRemoveStaff = (staffId: string) => {
    ServiceSections.removeStaff(section?.id, staffId)
      .then((res) => console.log(res))
      .catch((e) => console.log(e))
  }

  const staffSection = section?.staff?.map((staffId) =>
    staff?.find((s) => s?.id === staffId)
  )
  const orders = []
  const reports = []
  const canEditSection = canEditStaff
  const storeItems = Object.values(store?.items || {})
  const sectionItems =
    storeItems?.filter((i) => i?.assignedSection === section?.id) || []
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 'auto'
        }}
      >
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

        <Text style={[styles?.title]}>{section?.name} </Text>
        <ButtonIcon
          variant="ghost"
          icon="edit"
          color="secondary"
          onPress={() => {
            // @ts-ignore
            navigation.navigate('ScreenSectionsEdit', {
              sectionId: section?.id
            })
          }}
          disabled={!canEditSection}
        ></ButtonIcon>
      </View>

      <Tabs
        tabs={[
          {
            title: 'Staff',
            content: (
              <>
                <TextInfo text="Descarta o edita staff que ya pertenece a esta AREA" />
                <ListStaff
                  staff={staffSection}
                  sectionId={section.id}
                  handleSubtract={(staffId) => {
                    handleRemoveStaff(staffId)
                  }}
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
            content: <ListStoreItems items={sectionItems} />,
            show: true
          }
          // {
          //   title: 'Orders',
          //   content: <ListOrders orders={orders} />,
          //   show: true
          // },
          // {
          //   title: 'Reports',
          //   content: <ListOrders orders={reports} />,
          //   show: true
          // }
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
