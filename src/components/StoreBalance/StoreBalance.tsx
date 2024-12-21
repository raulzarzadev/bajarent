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

const StoreBalance = () => {
  const { storeId, currentBalance, store } = useStore()

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
      console.log({ balance })
      setBalance(balance[0])
    })
  }

  return (
    <View>
      <HeaderDate
        debounce={400}
        onChangeDate={(date) => {
          handleSetBalanceDate(date)
          setDate(date)
        }}
      />
      {isToday(date) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 4,
            marginHorizontal: 'auto'
          }}
        >
          <Button
            //justIcon
            // variant="ghost"
            disabled={loading}
            fullWidth={false}
            size="xs"
            icon="refresh"
            label="Actualizar"
            onPress={() => {
              handleUpdateBalance()
            }}
          />
        </View>
      )}

      {!!balance && (
        <>
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
                content: <GeneralBalanceE />,
                show: true,
                disabled: true
              },
              {
                title: 'Rentas',
                content: <RentsBalanceE balance={balance} />,
                show: true
              },
              {
                title: 'Ventas',
                content: <SalesBalanceE />,
                show: true,
                disabled: true
              },
              {
                title: 'Reparaciones',
                content: <RepairsBalanceE />,
                show: true,
                disabled: true
              }
            ]}
          />
        </>
      )}
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
