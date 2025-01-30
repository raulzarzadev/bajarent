import ErrorBoundary from '../ErrorBoundary'

import { ListCustomersE } from '../ListClients'
const ScreenCustomers = () => {
  return <ListCustomersE />
}
export default ScreenCustomers
export type ScreenCustomersProps = {}
export const ScreenCustomersE = (props: ScreenCustomersProps) => (
  <ErrorBoundary componentName="ScreenCustomers">
    <ScreenCustomers {...props} />
  </ErrorBoundary>
)
