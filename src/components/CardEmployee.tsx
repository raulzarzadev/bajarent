import { View, Text } from 'react-native'
import React from 'react'
import { useEmployee } from '../contexts/employeeContext'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'

const CardEmployee = () => {
  const { employee } = useEmployee()
  return (
    <View>
      {employee?.isOwner ? (
        <Text style={gStyles.h2}>Dueño</Text>
      ) : (
        <Text style={gStyles.h2}>Empleado</Text>
      )}
      <Text style={gStyles.h3}>{employee?.name}</Text>
      {employee?.permissions?.isAdmin && <Text style={gStyles.h1}>Admin</Text>}
    </View>
  )
}
export const CardEmployeeE = (props) => {
  return (
    <ErrorBoundary componentName="CardEmployee">
      <CardEmployee {...props} />
    </ErrorBoundary>
  )
}

export default CardEmployee
