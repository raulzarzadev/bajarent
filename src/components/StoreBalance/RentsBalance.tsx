import { View } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceType } from '../../types/StoreBalance'
import { order_type } from '../../types/OrderType'
import Tabs from '../Tabs'
import { useStore } from '../../contexts/storeContext'
import { SectionBalanceRentsE } from './SectionBalanceRents'
import BalanceItemsTable from './BalanceItemsTable'

const RentsBalance = ({ balance }: RentsBalanceProps) => {
  const { sections: storeSections } = useStore()
  const rents = balance?.orders?.filter(
    (order) => order?.orderType === order_type.RENT
  )
  //* group by section

  const groupedBySections = rents?.reduce((acc, order) => {
    if (!order?.assignedSection) order.assignedSection = 'withoutSection'
    if (!acc[order.assignedSection]) acc[order.assignedSection] = []
    acc[order.assignedSection].push(order)
    return acc
  }, {} as { [key: string]: StoreBalanceType['orders'] })

  const sectionsInfo = Object.keys(groupedBySections).map((sectionId) => {
    return {
      sectionId,
      sectionName:
        storeSections?.find((section) => section.id === sectionId)?.name ||
        'Sin asignar'
    }
  })
  const sectionsTabs = sectionsInfo
    .sort((a, b) => a.sectionName.localeCompare(b.sectionName))
    .map(({ sectionName, sectionId }) => ({
      title: sectionName,
      content: (
        <SectionBalanceRentsE
          orders={groupedBySections[sectionId]}
          balance={balance}
          title={sectionName}
          sectionId={sectionId}
        />
      ),
      show: true
    }))

  return (
    <View>
      <Tabs
        tabId="rents-balance"
        defaultTab="Todo"
        tabs={[
          {
            title: 'Todo',
            content: (
              <SectionBalanceRentsE
                orders={rents}
                balance={balance}
                title={'Todo'}
                sectionId={'all'}
              />
            ),
            show: true
          },
          {
            title: 'Artículos',
            content: <BalanceItemsTable balance={balance} />,
            show: true
          },

          ...sectionsTabs
        ]}
      />
    </View>
  )
}

export type RentsBalanceProps = {
  balance: StoreBalanceType
}
export const RentsBalanceE = (props: RentsBalanceProps) => (
  <ErrorBoundary componentName="RentsBalance">
    <RentsBalance {...props} />
  </ErrorBoundary>
)
export default RentsBalance
