import { ActivityIndicator, ScrollView, View } from 'react-native'
import React from 'react'
import ButtonIcon from './ButtonIcon'
import { ServiceStaff } from '../firebase/ServiceStaff'
import ButtonConfirm from './ButtonConfirm'
import { ScreenStoreEmployeeE } from './ScreenStoreEmployee'
import { useAuth } from '../contexts/authContext'

const ScreenStaffDetails = ({ route, navigation }) => {
  const staffId = route.params.staffId
  const { store } = useAuth()
  const staff = store?.staff || []
  const employee = staff?.find(({ id }) => id === staffId)
  if (!employee) return <ActivityIndicator />
  return (
    <ScrollView>
      <View
        style={{
          justifyContent: 'center',
          margin: 'auto'
        }}
      >
        <View style={{ margin: 'auto', flexDirection: 'row' }}>
          <ButtonConfirm
            text="¿Desea eliminar este empleado?"
            justIcon
            icon="delete"
            openVariant="ghost"
            openColor="error"
            confirmColor="error"
            confirmLabel="Eliminar"
            modalTitle="Eliminar Empleado"
            handleConfirm={async () => {
              return await ServiceStaff.removeStaffFromStore(
                employee.storeId,
                staffId
              )
                .then(() => {
                  navigation.goBack()
                })
                .catch((e) => console.log(e))
            }}
          ></ButtonConfirm>
          <ButtonIcon
            icon="edit"
            variant="ghost"
            color="secondary"
            onPress={() => {
              navigation.navigate('StaffEdit', { staffId })
            }}
          ></ButtonIcon>
        </View>
        <ScreenStoreEmployeeE staffId={staffId} />
      </View>
    </ScrollView>
  )
}

export default ScreenStaffDetails
