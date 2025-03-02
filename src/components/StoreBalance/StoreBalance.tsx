import { Text, View } from 'react-native'
import Tabs from '../Tabs'
import { RentsBalanceE } from './RentsBalance'
import { SalesBalanceE } from './SalesBalance'
import { RepairsBalanceE } from './RepairsBalance'
import { GeneralBalanceE } from './GeneralBalance'
import Button from '../Button'
import { ServiceBalances } from '../../firebase/ServiceBalances3'
import { useStore } from '../../contexts/storeContext'
import { useEffect, useState } from 'react'
import asDate, { dateFormat } from '../../libs/utils-date'
import ErrorBoundary from '../ErrorBoundary'
import { gStyles } from '../../styles'
import HeaderDate from '../HeaderDate'
import { StoreBalanceType } from '../../types/StoreBalance'
import { isToday } from 'date-fns'
import ModalCloseOperations from '../../ModalCloseOperations'
import { useNavigation } from '@react-navigation/native'

const StoreBalance = () => {
  const { storeId, currentBalance, store } = useStore()
  const { navigate } = useNavigation()

  const [balance, setBalance] = useState<StoreBalanceType>()
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    setBalance(currentBalance)
  }, [])

  const [loading, setLoading] = useState(false)

  const handleUpdateBalance = async () => {
    setLoading(true)
    const newBalance = await ServiceBalances.createV3(storeId).catch((e) => {
      console.error(e)
    })

    if (newBalance) {
      await ServiceBalances.saveBalance(newBalance).catch((e) => {
        console.error(e)
      })
    }

    setLoading(false)
  }

  const handleSetBalanceDate = (date: Date) => {
    ServiceBalances.getLastInDate(store?.id, date).then((balance) => {
      setBalance(balance[0])
    })
  }

  return (
    <View style={{ marginBottom: 44 }}>
      <HeaderDate
        debounce={400}
        onChangeDate={(date) => {
          handleSetBalanceDate(date)
          setDate(date)
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

      {!!balance && <BalanceView balance={balance} />}
    </View>
  )
}

export const BalanceView = ({ balance }: { balance: StoreBalanceType }) => {
  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 12,
          marginTop: 4,
          ...gStyles.helper
        }}
      >
        Última actualización:{' '}
        <Text style={gStyles.tBold}>
          {dateFormat(asDate(balance?.createdAt), 'dd/MMM/yy HH:mm')}
        </Text>
      </Text>
      <Tabs
        tabId="store-balance"
        tabs={[
          {
            title: 'General',
            content: <GeneralBalanceE balance={balance} />,
            show: true
            //disabled: true
          },
          {
            title: 'Rentas',
            content: <RentsBalanceE balance={balance} />,
            show: true
          },
          {
            title: 'Reparaciones',
            content: <RepairsBalanceE balance={balance} />,
            show: true
            //disabled: true
          },
          {
            title: 'Ventas',
            content: <SalesBalanceE balance={balance} />,
            show: true
            // disabled: true
          }
        ]}
      />
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
