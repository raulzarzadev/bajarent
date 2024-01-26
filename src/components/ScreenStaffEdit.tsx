import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormStaff from './FormStaff'
import { useStore } from '../contexts/storeContext'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { Card } from 'react-native-elements'
import CardUser from './CardUser'

const ScreenStaffEdit = ({ route, navigation }) => {
  const { staff } = useStore()
  if (!staff.length) return <ActivityIndicator />
  const staffId = route.params.staffId
  const employee = staff.find(({ id }) => id === staffId)
  return (
    <View>
      <CardUser userId={employee.userId} />
      <FormStaff
        defaultValues={employee}
        onSubmit={async (values) => {
          ServiceStaff.update(staffId, values)
            .then((res) => {
              // console.log(res)
              navigation.goBack()
            })
            .catch(console.error)
        }}
      />
    </View>
  )
}

export default ScreenStaffEdit

const styles = StyleSheet.create({})
