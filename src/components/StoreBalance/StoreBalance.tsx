import { View } from 'react-native'
import Button from '../Button'
import { ServiceBalances } from '../../firebase/ServiceBalances3'
import { useStore } from '../../contexts/storeContext'
import { useEffect, useState } from 'react'
import ErrorBoundary from '../ErrorBoundary'
import HeaderDate from '../HeaderDate'
import { StoreBalanceType } from '../../types/StoreBalance'
import { isToday } from 'date-fns'
import ModalCloseOperations from '../../ModalCloseOperations'
import { useNavigation } from '@react-navigation/native'
import { BalanceViewE } from './BalanceView'
import Loading from '../Loading'

const StoreBalance = () => {
  const { storeId, currentBalance } = useStore()
  const { navigate } = useNavigation()
  const [balance, setBalance] = useState<StoreBalanceType>()
  const [date, setDate] = useState<Date>()
  useEffect(() => {
    const localStorageDate = localStorage.getItem('storeBalanceDate')
    if (localStorageDate) {
      setDate(new Date(localStorageDate))
      handleSetBalanceDate(new Date(localStorageDate))
    } else {
      const date = new Date()
      localStorage.setItem('storeBalanceDate', date.toISOString())
      handleSetBalanceDate(date)
    }
  }, [])
  console.log({ date })
  const [loading, setLoading] = useState(false)

  const handleUpdateBalance = async () => {
    setLoading(true)
    const newBalance = await ServiceBalances.createV3(storeId).catch((e) => {
      console.error(e)
    })

    if (newBalance) {
      await ServiceBalances.saveBalance({ ...newBalance, type: 'daily' }).catch(
        (e) => {
          console.error(e)
        }
      )
    }

    setLoading(false)
  }

  const handleSetBalanceDate = (date: Date) => {
    ServiceBalances.getLastInDate({
      storeId,
      date,
      type: 'daily'
    }).then((balance) => {
      setBalance(balance[0])
    })
  }

  if (!date) return <Loading />

  return (
    <View style={{ marginBottom: 44 }}>
      <HeaderDate
        defaultDate={date}
        debounce={400}
        onChangeDate={(date) => {
          handleSetBalanceDate(date)
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: 4,
          marginHorizontal: 'auto',
          flexWrap: 'wrap',
          width: '100%',
          height: 40
        }}
      >
        <Button
          size="xs"
          icon="calendar"
          variant="ghost"
          label="Custom"
          onPress={() => {
            //@ts-ignore
            navigate('StackBalances', {
              screen: 'CustomBalanceDate'
            })
          }}
        />

        {isToday(date) && (
          <Button
            //justIcon
            // variant="ghost"
            disabled={loading}
            size="xs"
            icon="refresh"
            label="Actualizar"
            onPress={() => {
              handleUpdateBalance()
            }}
          />
        )}
        <Button
          label="Retirar"
          icon="moneyOff"
          size="xs"
          onPress={() => {
            //@ts-ignore
            navigate('StackPayments', {
              screen: 'ScreenRetirementsNew'
            })
          }}
          variant="ghost"
        />
        <ModalCloseOperations />
      </View>

      {!!balance && <BalanceViewE balance={balance} />}
    </View>
  )
}

export type StoreBalanceProps = {}
export const StoreBalanceE = (props: StoreBalanceProps) => (
  <ErrorBoundary componentName="StoreBalance">
    <StoreBalance {...props} />
  </ErrorBoundary>
)

export default StoreBalance
