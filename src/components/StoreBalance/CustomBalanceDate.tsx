import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import InputDatesRage from '../InputDatesRage'
import Button from '../Button'
import { ServiceBalances } from '../../firebase/ServiceBalances3'
import { useStore } from '../../contexts/storeContext'
import { useEffect, useState } from 'react'
import asDate, { dateFormat, startDate } from '../../libs/utils-date'
import { BalanceView } from './StoreBalance'
import { StoreBalanceType } from '../../types/StoreBalance'
import { limit, where } from 'firebase/firestore'
import { payments_amount } from '../../libs/payments'
import { StaffName } from '../CardStaff'
import List from '../List'

const CustomBalanceDate = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [balance, setBalance] = useState<StoreBalanceType>()
  const [dates, setDates] = useState({
    fromDate: startDate(new Date()),
    toDate: new Date()
  })

  const { store } = useStore()

  const handleCalculateBalance = () => {
    setLoading(true)
    ServiceBalances.createV3(store?.id, {
      fromDate: dates.fromDate,
      toDate: dates.toDate,
      progress: (progress) => {
        setProgress(progress)
      }
    })
      .then((balance) => {
        setBalance(balance)
        ServiceBalances.saveBalance({ ...balance, type: 'custom' })
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <ScrollView>
      <View style={{ margin: 'auto', maxWidth: 400, marginVertical: 40 }}>
        <InputDatesRage
          defaultValues={dates}
          onChange={setDates}
          disabled={loading}
        />
      </View>
      <View style={{ margin: 'auto' }}>
        <Button
          disabled={loading}
          onPress={() => handleCalculateBalance()}
          label="Calcular"
          progress={progress}
        />
      </View>
      {!!balance && <BalanceView balance={balance} />}
      <ListCustomBalancesE />
    </ScrollView>
  )
}
export default CustomBalanceDate

export type CustomBalanceDateProps = {}
export const CustomBalanceDateE = (props: CustomBalanceDateProps) => (
  <ErrorBoundary componentName="CustomBalanceDate">
    <CustomBalanceDate {...props} />
  </ErrorBoundary>
)

export const ListCustomBalancesE = () => {
  return (
    <ErrorBoundary componentName="ListCustomBalances">
      <ListCustomBalances />
    </ErrorBoundary>
  )
}
export const ListCustomBalances = () => {
  const [lastBalances, setLastBalances] = useState<StoreBalanceType[]>([])
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    ServiceBalances.findMany([where('type', '==', 'custom'), limit(count)])
      .then(setLastBalances)
      .catch((e) => {
        console.error(e)
      })
  }, [count])

  return (
    <View style={{ width: '100%', maxWidth: 1000, margin: 'auto' }}>
      <List
        ComponentRow={({ item }) => <RowCustomBalance balance={item} />}
        data={lastBalances}
      />
    </View>
  )
}

export const RowCustomBalance = (props?: RowCustomBalanceProps) => {
  const { balance } = props
  const amounts = payments_amount(balance.payments)
  console.log({ amounts })
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <Text style={{ width: '15%' }}>
        <StaffName userId={balance?.createdBy} />
      </Text>
      <Text style={{ width: '15%' }}>
        {dateFormat(asDate(balance?.createdAt), 'dd/MM/yy HH:mm')}
      </Text>
      <Text style={{ width: '15%' }}>
        {dateFormat(asDate(balance?.fromDate), 'dd/MM/yy HH:mm')}
      </Text>
      <Text style={{ width: '15%' }}>
        {dateFormat(asDate(balance?.toDate), 'dd/MM/yy HH:mm')}
      </Text>
      <Text style={{ width: '15%' }}>{balance.payments.length}</Text>
      <Text style={{ width: '15%' }}>{amounts.incomes}</Text>
    </View>
  )
}
export type RowCustomBalanceProps = {
  balance: StoreBalanceType
}
export const RowCustomBalanceE = (props: RowCustomBalanceProps) => (
  <ErrorBoundary componentName="RowCustomBalance">
    <RowCustomBalance {...props} />
  </ErrorBoundary>
)
