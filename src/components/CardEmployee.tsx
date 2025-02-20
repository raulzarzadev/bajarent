import { View, Text } from 'react-native'
import { useEmployee } from '../contexts/employeeContext'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import BadgesStore from './BadgesStore'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../contexts/storeContext'

const CardEmployee = () => {
  const { store } = useStore()
  const { employee } = useEmployee()
  const { navigate } = useNavigation()
  return (
    <View>
      {store && (
        <>
          <View>
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
          {/* 
          -----> * SHOWS badges if is admin , owner 
          */}
          <BadgesStore />

          <Text style={gStyles.h3}>{employee?.name}</Text>
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
