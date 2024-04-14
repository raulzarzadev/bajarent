import { Text, View } from 'react-native'
import React, { useState } from 'react'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'
import FormikCheckbox from './FormikCheckbox'
import InputCheckbox from './InputCheckbox'
import Button from './Button'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { gStyles } from '../styles'

const ScreenEmployee = () => {
  const { staff } = useStore()
  const {
    user: { id: userId }
  } = useAuth()
  const employee = staff.find((staff) => staff.userId === userId)
  console.log({ employee })
  const permissions = Object.keys(employee?.permissions || {})
  const [value, setValue] = useState(false)
  const handleSubmit = () => {
    ServiceStaff.update(employee.id, {
      permissions: {
        orders: {
          canDelete: value
        }
      }
    })
      .then(console.log)
      .catch(console.error)
  }
  console.log({ permissions })

  return (
    <View>
      <View style={{ marginVertical: 16 }}>
        <Text>Permisos de empleado</Text>
      </View>
      <Text>Empleado</Text>
      <View>
        <Text style={gStyles.helper}>
          Configuraciones rapidas.Puedes editar los permisos predefinidos
        </Text>
        <InputCheckbox setValue={setValue} value={value} label="Admin" />
        <InputCheckbox setValue={setValue} value={value} label="Caja" />
        <InputCheckbox setValue={setValue} value={value} label="Operación" />
        <InputCheckbox setValue={setValue} value={value} label="Visitante" />
      </View>

      <Button
        onPress={() => {
          handleSubmit()
        }}
      />
    </View>
  )
}

export default ScreenEmployee
