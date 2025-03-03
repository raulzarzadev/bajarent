import { ScrollView, View } from 'react-native'
import { useEffect, useState } from 'react'

import { ServiceBalances } from '../firebase/ServiceBalances3'
import { StoreBalanceType } from '../types/StoreBalance'
import { BalanceView } from './StoreBalance/StoreBalance'
import asDate from '../libs/utils-date'

import DocMetadata from './DocMetadata'
import DateCell from './DateCell'
import Icon from './Icon'
import Button from './Button'
import { useNavigation } from '@react-navigation/native'
import { useEmployee } from '../contexts/employeeContext'
import ButtonConfirm from './ButtonConfirm'

const ScreenBalance_v3 = ({ route }) => {
  const { permissions } = useEmployee()
  const [balance, setBalance] = useState<StoreBalanceType>(null)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchBalance = async () => {
      ServiceBalances.get(route?.params?.id)
        .then((balance) => {
          setBalance(balance)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    fetchBalance()
  }, [])

  const handleDelete = async () => {
    setLoading(true)
    await ServiceBalances.delete(balance.id)
    navigation.goBack()
    setLoading(false)
  }

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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 40
        }}
      >
        <ButtonConfirm
          modalTitle="Eliminar balance"
          handleConfirm={handleDelete}
          openDisabled={!permissions?.isAdmin}
          openSize="xs"
          openLabel="Eliminar"
          openColor="error"
          openVariant="outline"
          icon="delete"
          confirmColor="error"
          confirmLabel="Eliminar"
          confirmVariant="outline"
          confirmIcon="delete"
          text="Se eliminará este balance de forma permanente. ¿Estás seguro?"
        ></ButtonConfirm>
      </View>
    </ScrollView>
  )
}

export default ScreenBalance_v3
