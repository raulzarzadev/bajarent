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
import { limit, orderBy, where } from 'firebase/firestore'
import { payments_amount } from '../../libs/payments'
import { StaffName } from '../CardStaff'
import List from '../List'
import useMyNav from '../../hooks/useMyNav'
import Loading from '../Loading'
import { gStyles } from '../../styles'
import CurrencyAmount from '../CurrencyAmount'
import dictionary from '../../dictionary'
import { useEmployee } from '../../contexts/employeeContext'

const CustomBalanceDate = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [balance, setBalance] = useState<StoreBalanceType>()
  const [dates, setDates] = useState({
    fromDate: startDate(new Date()),
    toDate: new Date()
  })
  const {
    permissions: { isAdmin }
  } = useEmployee()
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
      {isAdmin && <ListCustomBalancesE />}
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
  const { toBalance } = useMyNav()
  const [balances, setBalances] = useState<StoreBalanceType[]>([])
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(true)
  const [limitFound, setLimitFound] = useState(false)
  const { storeId } = useStore()

  useEffect(() => {
    ServiceBalances.findMany([
      where('storeId', '==', storeId),
      limit(count),
      orderBy('createdAt', 'desc')
    ])
      .then(setBalances)
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [count])

  const handleGetMore = () => {
    setCount(count + 5)
    if (count > balances.length) {
      setLimitFound(true)
    }
  }

  if (loading) return <Loading />

  return (
    <View style={{ width: '100%', margin: 'auto' }}>
      <List
        rowsPerPage={40}
        ComponentRow={({ item }) => <RowCustomBalance balance={item} />}
        data={balances}
        onPressRow={(itemId) => {
          toBalance({ to: 'details', id: itemId })
        }}
        sortFields={[
          {
            key: 'createdBy',
            label: 'Autor'
          },
          {
            key: 'createdAt',
            label: 'Creado'
          },
          {
            key: 'type',
            label: 'Tipo'
          },
          {
            key: 'fromDate',
            label: 'Desde'
          },
          {
            key: 'toDate',
            label: 'Hasta'
          },
          {
            key: 'payments',
            label: 'Pagos'
          },
          {
            key: 'amounts',
            label: 'Ingresos'
          }
        ]}
        filters={[
          {
            field: 'type',
            label: 'Tipo'
          }
        ]}
      />
      {limitFound && (
        <Text style={[gStyles.helper, gStyles.tCenter]}>
          *No hay mas registros
        </Text>
      )}
      <Button
        onPress={() => {
          handleGetMore()
        }}
        disabled={limitFound}
        label="mostrar mas"
        size="xs"
        variant="ghost"
      />
    </View>
  )
}

export const RowCustomBalance = (props?: RowCustomBalanceProps) => {
  const { balance } = props
  const amounts = payments_amount(balance.payments)
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 4
      }}
    >
      <Text style={{ width: '10%' }}>
        <StaffName userId={balance?.createdBy} />
      </Text>
      <Text style={{ width: '15%' }}>
        {dateFormat(asDate(balance?.createdAt), 'dd/MM/yy HH:mm')}
      </Text>
      <Text style={{ width: '10%' }}>{dictionary(balance.type)}</Text>
      <Text style={{ width: '15%' }}>
        {dateFormat(asDate(balance?.fromDate), 'dd/MM/yy HH:mm')}
      </Text>
      <Text style={{ width: '15%' }}>
        {dateFormat(asDate(balance?.toDate), 'dd/MM/yy HH:mm')}
      </Text>
      <Text style={{ width: '5%' }}>{balance.payments.length}</Text>
      <Text style={{ width: '15%' }}>
        <CurrencyAmount amount={amounts.incomes} />
      </Text>
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
