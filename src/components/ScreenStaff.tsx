import { ScrollView, Text, View } from 'react-native'
import { useShop } from '../hooks/useShop'
import { gStyles } from '../styles'
import ErrorBoundary from './ErrorBoundary'
import ListStaff from './ListStaff2'
import Loading from './Loading'

const ScreenStaff = () => {
  const { shop } = useShop()
  const shopStaff = shop?.staff || []

  if (!shop) return <Loading id="ScreenStaff" />

  return (
    <ScrollView
      style={{
        width: '100%'
      }}
    >
      <View style={gStyles.container}>
        <Text style={gStyles.h2}>Lista de empleados</Text>
        <ListStaff shop={shop} staff={shopStaff} />
      </View>
    </ScrollView>
  )
}

export const ScreenStaffE = () => (
  <ErrorBoundary componentName="ScreenStaff">
    <ScreenStaff />
  </ErrorBoundary>
)

export default ScreenStaff
