import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import ButtonIcon from './ButtonIcon'
import { ServiceStaff } from '../firebase/ServiceStaff'
import CardStaff from './CardStaff'

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
        <View style={{ margin: 'auto', flexDirection: 'row' }}>
          <ButtonIcon
            icon="delete"
            variant="ghost"
            color="error"
            onPress={() => {
              ServiceStaff.removeStaffFromStore(employee.storeId, staffId)
                .then((res) => {
                  console.log(res)
                  navigation.goBack()
                })
                .catch(console.error)
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
        <CardStaff staff={employee} />
      </View>
    </View>
  )
}

export default ScreenStaffDetails
