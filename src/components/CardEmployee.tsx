import { View, Text } from 'react-native'
import React from 'react'
import { useEmployee } from '../contexts/employeeContext'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import dictionary from '../dictionary'
import Chip from './Chip'
import theme from '../theme'

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
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          maxWidth: 500,
          justifyContent: 'center'
        }}
      >
        {Object.entries(employee?.permissions?.order || {}).map(
          ([key, value]) =>
            value && (
              <Chip
                key={key}
                title={dictionary(key)}
                color={theme.secondary}
                style={{ margin: 4 }}
                titleColor={theme.white}
              />
            )
        )}
      </View>
      <Text style={[gStyles.p, gStyles.tCenter]}>{employee?.position}</Text>
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
