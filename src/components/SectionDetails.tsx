import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SectionType } from '../types/SectionType'

import ModalSelectStaff from './ModalSelectStaff'
import { useStore } from '../contexts/storeContext'
import { ServiceSections } from '../firebase/ServiceSections'
import ListStaff from './ListStaff'
import ButtonIcon from './ButtonIcon'
import { useNavigation } from '@react-navigation/native'

const SectionDetails = ({ section }: { section: SectionType }) => {
  const { staff } = useStore()
  const navigation = useNavigation()
  const handleAddStaff = (staffId: string) => {
    ServiceSections.addStaff(section.id, staffId)
  }
  const handleRemoveStaff = (staffId: string) => {
    ServiceSections.removeStaff(section.id, staffId)
  }

  const handleSelectStaff = (staffId: string) => {
    if (section?.staff?.includes(staffId)) {
      handleRemoveStaff(staffId)
    } else {
      handleAddStaff(staffId)
    }
  }

  return (
    <View>
      <Text style={styles.title}>
        {section.name}{' '}
        <ButtonIcon
          icon="edit"
          onPress={() => {
            // @ts-ignore
            navigation.navigate('EditSection', { sectionId: section.id })
          }}
        ></ButtonIcon>
      </Text>
      <Text style={styles.subtitle}>Staff </Text>
      <ListStaff
        staff={section?.staff?.map((id) => staff.find((s) => s.id === id))}
        onPress={handleSelectStaff}
      />
      <ModalSelectStaff
        staff={staff}
        onPress={(id) => {
          handleSelectStaff(id)
        }}
        staffSelected={section?.staff}
      />
    </View>
  )
}

export default SectionDetails

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
