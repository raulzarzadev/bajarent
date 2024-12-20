import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { useStore } from '../../contexts/storeContext'
import { useEmployee } from '../../contexts/employeeContext'
import StoreType from '../../types/StoreType'
import { StoreBalanceType } from '../../types/StoreBalance'

const CurrentWork = () => {
  const { currentBalance, sections } = useStore()
  const { permissions } = useEmployee()

  const progress = formatCurrentWorkAsProgress({
    currentBalance,
    storeSections: sections || []
  })

  console.log('progress', progress, { currentBalance })

  if (permissions.canViewModalCurrentWork) return null
  return (
    <View>
      <Text>CurrentWork</Text>
    </View>
  )
}

const formatCurrentWorkAsProgress = ({
  currentBalance,
  storeSections
}: {
  currentBalance: StoreBalanceType
  storeSections: StoreType['sections']
}) => {
  console.log({ currentBalance })

  const storeSectionsIds = storeSections?.map(({ id }) => id) || []
  const ordersSections = currentBalance.orders?.reduce((acc, order) => {
    const sectionId = order.assignedSection || 'Sin asignar'
    if (!acc[sectionId]) {
      acc[sectionId] = []
    }
    acc[sectionId].push(order)
    return acc
  }, {} as Record<string, typeof currentBalance.orders>)

  console.log({ ordersSections })

  return {}
}

export default CurrentWork

export type CurrentWorkProps = {}
export const CurrentWorkE = (props: CurrentWorkProps) => (
  <ErrorBoundary componentName="CurrentWork">
    <CurrentWork {...props} />
  </ErrorBoundary>
)
