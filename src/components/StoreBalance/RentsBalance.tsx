import { View, Text } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import { StoreBalanceType } from '../../types/StoreBalance'
import { order_type } from '../../types/OrderType'
import Tabs from '../Tabs'
import { useStore } from '../../contexts/storeContext'
import { SectionBalanceRentsE } from './SectionBalanceRents'
import SectionBalanceRentItemsE from './SectionBalanceRentItemsE'

const RentsBalance = ({ balance }: RentsBalanceProps) => {
  const { storeSections } = useStore()
  const rents = balance?.orders?.filter(
    (order) => order?.orderType === order_type.RENT
  )
  //console.log({ rents, actives, finished, renewed, delivered })
  //* group by section

  const sections = rents?.reduce((acc, order) => {
    if (!order?.assignedSection) order.assignedSection = 'withoutSection'
    if (!acc[order.assignedSection]) acc[order.assignedSection] = []
    acc[order.assignedSection].push(order)
    return acc
  }, {} as { [key: string]: StoreBalanceType['orders'] })

  const sectionsInfo = Object.keys(sections).map((sectionId) => {
    return {
      sectionId,
      sectionName:
        storeSections?.find((section) => section.id === sectionId)?.name ||
        'Sin asignar'
    }
  })
  const sectionsTabs = sectionsInfo.map(({ sectionName, sectionId }) => ({
    title: sectionName,
    content: (
      <SectionBalanceRentsE
        orders={sections[sectionId]}
        balance={balance}
        title={sectionName}
        items={balance.items.filter(
          (item) => item.assignedSection === sectionId
        )}
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
                items={balance.items}
              />
            ),
            show: true
          },
          {
            title: 'Artículos',
            content: <SectionBalanceRentItemsE items={balance.items} />,
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
