import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { FormCustomerE } from './FormCustomer'
const ScreenCustomerForm = () => {
  return (
    <View>
      <FormCustomerE />
    </View>
  )
}
export default ScreenCustomerForm
export type ScreenCustomerFormProps = {}
export const ScreenCustomerFormE = (props: ScreenCustomerFormProps) => (
  <ErrorBoundary componentName="ScreenCustomerForm">
    <ScreenCustomerForm {...props} />
  </ErrorBoundary>
)
