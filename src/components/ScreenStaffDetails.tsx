import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import P from './P'
import ButtonIcon from './ButtonIcon'

const ScreenStaffDetails = ({ route, navigation }) => {
  const staffId = route.params.staffId
  const { staff } = useStore()
  const employee = staff.find(({ id }) => id === staffId)
  if (!employee) return <ActivityIndicator />
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 'auto'
        }}
      >
        <P bold size="lg">
          {employee.name}
        </P>
        <ButtonIcon
          icon="edit"
          variant="ghost"
          onPress={() => {
            navigation.navigate('StaffEdit', { staffId })
          }}
        ></ButtonIcon>
      </View>
    </View>
  )
}

export default ScreenStaffDetails

const styles = StyleSheet.create({})
