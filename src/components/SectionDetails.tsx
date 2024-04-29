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

const SectionDetails = ({ section }: { section: SectionType }) => {
  const { staff } = useStore()
  const navigation = useNavigation()

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
        ></ButtonIcon>
      </View>
      <Tabs
        tabs={[
          {
            title: 'Staff',
            content: (
              <ListStaff
                staff={staffSection}
                sectionId={section.id}
                handleSubtract={(staffId) => {
                  handleRemoveStaff(staffId)
                }}
              />
            ),
            show: true
          },
          {
            title: 'Orders',
            content: <ListOrders orders={orders} />,
            show: true
          },
          {
            title: 'Reports',
            content: <ListOrders orders={reports} />,
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
