import { useNavigation } from '@react-navigation/native'
import { isToday, toDate } from 'date-fns'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useStore } from '../../contexts/storeContext'
import { ServiceBalances } from '../../firebase/ServiceBalances3'
import catchError from '../../libs/catchError'
import { getItem, setItem } from '../../libs/storage'
import ModalCloseOperations from '../../ModalCloseOperations'
import type { StoreBalanceType } from '../../types/StoreBalance'
import { firebaseSafeSave } from '../../utils/firebaseSafeSave'
import Button from '../Button'
import ErrorBoundary from '../ErrorBoundary'
import HeaderDate from '../HeaderDate'
import Loading from '../Loading'
import { BalanceViewE } from './BalanceView'

const StoreBalance = () => {
  const { storeId } = useStore()
  const { navigate } = useNavigation()
  const [balance, setBalance] = useState<StoreBalanceType>()
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    const today = new Date()
    getItem('storeBalanceDate').then((storeDate) => {
      if (storeDate) {
        const storedDate = toDate(storeDate)
        setDate(storedDate)
        handleSetBalanceDate(storedDate)
      } else {
        setDate(today)
        handleSetBalanceDate(today)
      }
    })
  }, [])

  const [loading, setLoading] = useState(false)

  const handleUpdateBalance = async () => {
    setLoading(true)
    const newBalance = await ServiceBalances.createV3(storeId).catch((e) => {
      console.error(e)
    })

    if (newBalance) {
      newBalance.type = 'daily'
      const [err, _] = await catchError(
        firebaseSafeSave({
          data: newBalance,
          contextLabel: 'StoreBalance - update balance',
          saveFn: ServiceBalances.saveBalance
        })
      )
      if (err) {
        console.error('Error saving balance:', err)
      }
    }

    setLoading(false)
  }

  const handleSetBalanceDate = (date: Date) => {
    setDate(date)
    setItem('storeBalanceDate', date.toISOString())
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
            //@ts-expect-error
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
            //@ts-expect-error
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

export const StoreBalanceE = () => (
  <ErrorBoundary componentName="StoreBalance">
    <StoreBalance />
  </ErrorBoundary>
)

export default StoreBalance
