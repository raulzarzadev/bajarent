import { View, Text, ScrollView } from 'react-native'
import ErrorBoundary from '../ErrorBoundary'
import InputDatesRage from '../InputDatesRage'
import Button from '../Button'
import { ServiceBalances } from '../../firebase/ServiceBalances3'
import { useStore } from '../../contexts/storeContext'
import { useState } from 'react'
import { startDate } from '../../libs/utils-date'
import { BalanceView } from './StoreBalance'
import { StoreBalanceType } from '../../types/StoreBalance'

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
