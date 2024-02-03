import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useModal from '../hooks/useModal'
import Button from './Button'
import StyledModal from './StyledModal'
import ListStaff from './ListStaff'
import StaffType from '../types/StaffType'

const ModalSelectStaff = ({
  onPress = (staffId) => console.log({ staffId }),
  staffSelected = [],
  staff
}: {
  onPress: (staffId: string) => void
  staffSelected: string[]
  staff: StaffType[]
}) => {
  const modal = useModal({ title: 'Seleccionar Staff' })
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <Button
        onPress={modal.toggleOpen}
        buttonStyles={{ paddingHorizontal: 8 }}
      >
        <Text>Agregar staff</Text>
      </Button>
      <StyledModal {...modal}>
        <Text>Seleccionar aun colaborador</Text>
        <ListStaff
          staffSelected={staffSelected}
          staff={staff}
          onPress={(staffId) => {
            onPress(staffId)
            modal.toggleOpen()
          }}
        />
      </StyledModal>
    </View>
  )
}

export default ModalSelectStaff

const styles = StyleSheet.create({})
