import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import Button from '../Button'
import useMyNav from '../../hooks/useMyNav'
const ScreenCustomers = () => {
  const { toCustomers } = useMyNav()
  return (
    <View>
      <Button
        size="xs"
        label="Nuevo cliente"
        onPress={() => {
          toCustomers({ to: 'new' })
        }}
      />
    </View>
  )
}
export default ScreenCustomers
export type ScreenCustomersProps = {}
export const ScreenCustomersE = (props: ScreenCustomersProps) => (
  <ErrorBoundary componentName="ScreenCustomers">
    <ScreenCustomers {...props} />
  </ErrorBoundary>
)
