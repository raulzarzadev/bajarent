import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { FormStaffE } from './FormStaff'
import { useStore } from '../contexts/storeContext'
import { ServiceStaff } from '../firebase/ServiceStaff'
import CardUser from './CardUser'
import { gStyles } from '../styles'
import UserType from '../types/UserType'

const ScreenStaffEdit = ({ route, navigation }) => {
  const { staff } = useStore() // <--Buscar staff
  if (!staff.length) return <ActivityIndicator />

  const staffId = route.params.staffId
  const employee = staff?.find(({ id }) => id === staffId)
  //const storeSections = store?.sections || []

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <CardUser user={employee as UserType} />

        <FormStaffE
          defaultValues={employee}
          onSubmit={async (values) => {
            ServiceStaff.update(staffId, values)
              .then((res) => {
                console.log(res)
                navigation.goBack()
              })
              .catch(console.error)
          }}
        />
      </View>
    </ScrollView>
  )
}

export default ScreenStaffEdit

const styles = StyleSheet.create({})
