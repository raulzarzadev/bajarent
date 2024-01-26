import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FormStaff from './FormStaff'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'

const ScreenStaffNew = () => {
  const { store } = useStore()
  const { navigate } = useNavigation()
  return (
    <View>
      <FormStaff
        onSubmit={async (values) => {
          console.log('onSubmit', values)
          values.storeId = store.id
          ServiceStaff.create(values).then((res) => {
            console.log(res)
            navigate('Staff')
          })
        }}
      />
    </View>
  )
}

export default ScreenStaffNew

const styles = StyleSheet.create({})
