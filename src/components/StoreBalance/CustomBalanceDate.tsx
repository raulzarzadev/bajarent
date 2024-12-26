import { View, Text } from 'react-native'
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
        console.log({ progress })
      }
    })
      .then((balance) => {
        setBalance(balance)
        console.log({ balance })
        // ServiceBalances.saveBalance(balance)
        //   .then(() => {
        //     console.log('Balance saved')
        //   })
        //   .catch((e) => {
        //     console.error(e)
        //   })
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <View>
      <InputDatesRage
        defaultValues={dates}
        onChange={setDates}
        disabled={loading}
      />
      <View style={{ margin: 'auto' }}>
        <Button
          disabled={loading}
          onPress={() => handleCalculateBalance()}
          label="Calcular"
        />
      </View>
      {balance && <BalanceView balance={balance} />}
    </View>
  )
}
export default CustomBalanceDate

export type CustomBalanceDateProps = {}
export const CustomBalanceDateE = (props: CustomBalanceDateProps) => (
  <ErrorBoundary componentName="CustomBalanceDate">
    <CustomBalanceDate {...props} />
  </ErrorBoundary>
)
