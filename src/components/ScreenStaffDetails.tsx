import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import ButtonIcon from './ButtonIcon'
import CardUser from './CardUser'
import { ServiceStaff } from '../firebase/ServiceStaff'

const ScreenStaffDetails = ({ route, navigation }) => {
  const staffId = route.params.staffId
  const { staff } = useStore()
  const employee = staff.find(({ id }) => id === staffId)
  if (!employee) return <ActivityIndicator />
  return (
    <View>
      <View
        style={{
          justifyContent: 'center',
          margin: 'auto'
        }}
      >
        {/* <P bold size="lg">
          {employee.name}
        </P> */}
        <View style={{ margin: 'auto', flexDirection: 'row' }}>
          <ButtonIcon
            icon="delete"
            variant="ghost"
            color="error"
            onPress={() => {
              ServiceStaff.delete(staffId).then(() => {
                navigation.navigate('Staff')
              })
            }}
          ></ButtonIcon>
          <ButtonIcon
            icon="edit"
            variant="ghost"
            color="secondary"
            onPress={() => {
              navigation.navigate('StaffEdit', { staffId })
            }}
          ></ButtonIcon>
        </View>
        <CardUser userId={employee.userId} />
        <View>
          <Text>Puesto: {employee.position}</Text>
        </View>
      </View>
    </View>
  )
}

export default ScreenStaffDetails

const styles = StyleSheet.create({})
