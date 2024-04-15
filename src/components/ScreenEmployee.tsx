import { Dimensions, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'
import FormikCheckbox from './FormikCheckbox'
import Button from './Button'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { gStyles } from '../styles'
import { Formik } from 'formik'
import { permissionsOrderKeys, permissionsStoreKeys } from '../types/StaffType'
import dictionary from '../dictionary'
import InputRadios from './InputRadios'
import { predefinedPermissions } from '../libs/predefinedPermissions'
const screenWidth = Dimensions.get('window').width

const checkboxWidth = screenWidth > 500 ? '33%' : '50%'

const ScreenEmployee = () => {
  const { staff } = useStore()
  const {
    user: { id: userId }
  } = useAuth()
  const employee = staff.find((staff) => staff.userId === userId)
  const handleSubmit = (values) => {
    ServiceStaff.update(employee.id, { permissions: values.permissions })
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <View style={gStyles.container}>
      <View style={{ marginVertical: 16 }}>
        <Text>Permisos de empleado</Text>
      </View>
      <Text>Empleado</Text>

      <Formik
        initialValues={{
          predefinedPermission: employee.predefinedPermission,
          permissions: employee.permissions
        }}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        {({ handleSubmit, isSubmitting, values }) => {
          const [sortedOrders, setSortedOrder] = useState(permissionsOrderKeys)
          const [sortedStores, setSortedStore] = useState(permissionsStoreKeys)
          useEffect(() => {
            setSortedOrder(
              permissionsOrderKeys.sort(
                (a, b) =>
                  values.permissions.order[b] - values.permissions.order[a]
              )
            )
            setSortedStore(
              permissionsStoreKeys.sort(
                (a, b) =>
                  values.permissions.store[b] - values.permissions.store[a]
              )
            )
          }, [values])
          return (
            <View>
              <Text>Permisos de ordenes</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {sortedOrders.map((permission) => (
                  <FormikCheckbox
                    style={{ width: checkboxWidth, marginVertical: 4 }}
                    key={permission}
                    name={`permissions.order.${permission}`}
                    label={dictionary(permission)}
                  />
                ))}
              </View>
              <Text>Permisos de tienda</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {sortedStores.map((permission) => (
                  <FormikCheckbox
                    style={{ width: checkboxWidth, marginVertical: 4 }}
                    key={permission}
                    name={`permissions.store.${permission}`}
                    label={dictionary(permission)}
                  />
                ))}
              </View>
              <Button
                disabled={isSubmitting}
                label="Guardar"
                onPress={() => handleSubmit()}
              />
            </View>
          )
        }}
      </Formik>
    </View>
  )
}

export default ScreenEmployee
