import { Text, View } from 'react-native'
import Tabs from '../Tabs'
import { RentsBalanceE } from './RentsBalance'
import { SalesBalanceE } from './SalesBalance'
import { RepairsBalanceE } from './RepairsBalance'
import { GeneralBalanceE } from './GeneralBalance'
import Button from '../Button'
import { ServiceBalances } from '../../firebase/ServiceBalances3'
import { useStore } from '../../contexts/storeContext'
import { useState } from 'react'
import asDate, { dateFormat } from '../../libs/utils-date'
import ErrorBoundary from '../ErrorBoundary'
import { gStyles } from '../../styles'

const StoreBalance = () => {
  const { storeId, currentBalance } = useStore()

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
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 8,
          marginHorizontal: 'auto'
        }}
      >
        <Button
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
          {dateFormat(asDate(currentBalance?.createdAt), 'dd/MMM/yy HH:mm')}
        </Text>
      </Text>
      {!!currentBalance && (
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
              content: <RentsBalanceE balance={currentBalance} />,
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
