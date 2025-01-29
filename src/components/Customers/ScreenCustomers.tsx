import ErrorBoundary from '../ErrorBoundary'
import { useCustomers } from '../../state/features/costumers/costumersSlice'
import ListCustomers from '../ListClients'
const ScreenCustomers = () => {
  const { data: customers } = useCustomers()
  return <ListCustomers customers={customers} />
}
export default ScreenCustomers
export type ScreenCustomersProps = {}
export const ScreenCustomersE = (props: ScreenCustomersProps) => (
  <ErrorBoundary componentName="ScreenCustomers">
    <ScreenCustomers {...props} />
  </ErrorBoundary>
)
