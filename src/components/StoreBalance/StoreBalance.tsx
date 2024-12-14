import { View } from 'react-native'
import Tabs from '../Tabs'
import { RentsBalanceE } from './RentsBalance'
import { SalesBalanceE } from './SalesBalance'
import { RepairsBalanceE } from './RepairsBalance'
import { GeneralBalanceE } from './GeneralBalance'

const StoreBalance = () => {
  return (
    <View>
      <Tabs
        tabId="store-balance"
        tabs={[
          {
            title: 'General',
            content: <GeneralBalanceE />,
            show: true
          },
          {
            title: 'Rentas',
            content: <RentsBalanceE />,
            show: true
          },
          {
            title: 'Ventas',
            content: <SalesBalanceE />,
            show: true
          },
          {
            title: 'Reparaciones',
            content: <RepairsBalanceE />,
            show: true
          }
        ]}
      />
    </View>
  )
}

export default StoreBalance
