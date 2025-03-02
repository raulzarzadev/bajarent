import { ScrollView, View } from 'react-native'
import React, { useEffect } from 'react'

import { ServiceBalances } from '../firebase/ServiceBalances3'
import { StoreBalanceType } from '../types/StoreBalance'
import { BalanceView, StoreBalanceE } from './StoreBalance/StoreBalance'
import asDate from '../libs/utils-date'

import DocMetadata from './DocMetadata'
import DateCell from './DateCell'
import Icon from './Icon'

const ScreenBalance_v3 = ({ route, navigation }) => {
  const [balance, setBalance] = React.useState<StoreBalanceType>(null)
  useEffect(() => {
    const fetchBalance = async () => {
      ServiceBalances.get(route?.params?.id).then((balance) => {
        setBalance(balance)
      })
    }
    fetchBalance()
  }, [])

  if (!balance) return <View /> //*<-- this should be a loading spinner
  return (
    <ScrollView>
      <DocMetadata
        item={balance}
        style={{ flexDirection: 'row', margin: 'auto' }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <DateCell
          date={asDate(balance.fromDate)}
          label="Desde"
          showTime
          showTimeAgo={false}
          labelBold
          showDay
        />
        <Icon icon="rowRight" />
        <DateCell
          date={asDate(balance.toDate)}
          label="Hasta"
          showTime
          showTimeAgo={false}
          labelBold
          showDay
        />
      </View>

      <BalanceView balance={balance} />
    </ScrollView>
  )
}

export default ScreenBalance_v3
