import { View, Text } from 'react-native'
import React from 'react'
import { useEmployee } from '../contexts/employeeContext'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import BadgesStore from './BadgesStore'
import { useAuth } from '../contexts/authContext'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'

const CardEmployee = () => {
  const { store } = useAuth()
  const { employee } = useEmployee()
  const { navigate } = useNavigation()
  return (
    <View>
      {store && (
        <>
          <View>
            {/* <Text style={gStyles.h2}>{store?.name}</Text> */}
            <Button
              label={store?.name}
              variant="ghost"
              size="xs"
              icon="arrowForward"
              onPress={() => {
                //@ts-ignore
                navigate('Store', { storeId: store.id })
              }}
            ></Button>
          </View>
          <BadgesStore />
          <Text style={gStyles.h3}>{employee?.name}</Text>
          {/* <EmployeePermissionsE staff={employee} /> */}
          <Text style={[gStyles.p, gStyles.tCenter]}>{employee?.position}</Text>
        </>
      )}
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
