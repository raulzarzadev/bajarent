import { ActivityIndicator, ScrollView, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import ButtonIcon from './ButtonIcon'
import { ServiceStaff } from '../firebase/ServiceStaff'
import CardStaff from './CardStaff'
import ButtonConfirm from './ButtonConfirm'
import ScreenEmployee from './ScreenEmployee'

const ScreenStaffDetails = ({ route, navigation }) => {
  const staffId = route.params.staffId
  const { staff } = useStore()
  const employee = staff.find(({ id }) => id === staffId)
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
        <CardStaff staff={employee} />
        <ScreenEmployee />
      </View>
    </ScrollView>
  )
}

export default ScreenStaffDetails
