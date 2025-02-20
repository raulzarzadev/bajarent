import { Pressable, StyleSheet, Text, TextStyle, View } from 'react-native'
import PaymentType from '../types/PaymentType'
import { payments_amount } from '../libs/payments'
import { gStyles } from '../styles'
import CurrencyAmount from './CurrencyAmount'
import { useNavigation } from '@react-navigation/native'
import ErrorBoundary from './ErrorBoundary'

export type BalanceAmountsProps = {
  payments: Partial<PaymentType>[]
  disableLinks?: boolean
}
const BalanceAmounts = ({
  payments = [],
  disableLinks
}: BalanceAmountsProps) => {
  const cashPayments = payments?.filter((p) => p.method === 'cash')
  const cardPayments = payments?.filter((p) => p.method === 'card')
  const transferPayments = payments?.filter((p) => p.method === 'transfer')
  const canceledPayments = payments?.filter((p) => p.canceled)
  const retirementBonus = payments.filter((p) => p.type === 'bonus')
  const retirementExpense = payments.filter((p) => p.type === 'expense')
  const retirementMissing = payments.filter((p) => p.type === 'missing')
  const notVerifiedTransfers = payments?.filter(
    (p) => p.method === 'transfer' && !p.verified
  )
  const allPayments = payments?.filter((p) => !p.canceled || !p.isRetirement)
  const {
    total,
    canceled,
    card,
    cash,
    transfers,
    transfersNotVerified,
    incomes,
    outcomes,
    missing,
    expense,
    bonus
  } = payments_amount(payments)

  return (
    <View>
      <View
        style={{
          //width: 180,
          // marginVertical: gSpace(2),
          marginHorizontal: 'auto'
        }}
      >
        <View style={styles.totals}>
          <Text style={gStyles.tBold}>Entradas</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            <LinkPayments
              disabled={disableLinks}
              paymentsIds={allPayments.map(({ id }) => id)}
              amount={incomes}
              title={'VENTAS'}
              isTotal
            />
          </View>
          {!!cash && (
            <View style={styles.row}>
              <LinkPayments
                disabled={disableLinks}
                paymentsIds={cashPayments.map(({ id }) => id)}
                amount={cash}
                title={'Efectivo'}
              />
            </View>
          )}
          {!!transfers && (
            <View style={styles.row}>
              <LinkPayments
                disabled={disableLinks}
                paymentsIds={transferPayments.map(({ id }) => id)}
                amount={transfers}
                title={'Transferencias'}
              />
            </View>
          )}
          {!!transfersNotVerified && (
            <View style={[styles.row]}>
              <LinkPayments
                disabled={disableLinks}
                labelStyle={gStyles.tError}
                paymentsIds={notVerifiedTransfers.map(({ id }) => id)}
                amount={transfersNotVerified}
                title={'No verificados'}
              />
            </View>
          )}
          {!!card && (
            <View style={styles.row}>
              <LinkPayments
                disabled={disableLinks}
                paymentsIds={cardPayments.map(({ id }) => id)}
                amount={card}
                title={'Tarjetas'}
              />
            </View>
          )}
        </View>
        {outcomes > 0 && <Text style={gStyles.tBold}>Salidas</Text>}
        {bonus > 0 && (
          <View style={styles.row}>
            <LinkPayments
              disabled={disableLinks}
              paymentsIds={retirementBonus.map(({ id }) => id)}
              amount={bonus * -1}
              title={'Bonos'}
            />
          </View>
        )}
        {expense > 0 && (
          <View style={styles.row}>
            <LinkPayments
              disabled={disableLinks}
              paymentsIds={retirementExpense.map(({ id }) => id)}
              amount={expense * -1}
              title={'Gastos'}
            />
          </View>
        )}
        {missing > 0 && (
          <View style={styles.row}>
            <LinkPayments
              disabled={disableLinks}
              paymentsIds={retirementMissing.map(({ id }) => id)}
              amount={missing * -1}
              title={'Faltante'}
            />
          </View>
        )}

        <Text style={gStyles.tBold}>Total</Text>
        {!!canceledPayments.length && (
          <View style={styles.row}>
            <LinkPayments
              disabled={disableLinks}
              paymentsIds={canceledPayments.map(({ id }) => id)}
              amount={canceled}
              title={'Cancelados'}
            />
          </View>
        )}
        <View style={styles.row}>
          <LinkPayments
            disabled={disableLinks}
            amount={total}
            title={''}
            labelStyle={gStyles.tBold}
          />
        </View>
      </View>
    </View>
  )
}

const LinkPayments = ({
  title,
  paymentsIds = [],
  amount = 0,
  isTotal = false,
  labelStyle,
  disabled
}: {
  title: string
  paymentsIds?: string[]
  amount?: number
  isTotal?: boolean
  labelStyle?: TextStyle
  disabled?: boolean
}) => {
  const { navigate } = useNavigation()
  return (
    <View style={[{ flexDirection: 'row' }]}>
      <Pressable
        disabled={disabled}
        onPress={() => {
          //@ts-ignore
          navigate('StackPayments', {
            screen: 'ScreenPayments',
            params: {
              title,
              payments: paymentsIds
            }
          })
        }}
      >
        <View
          style={[
            { marginRight: 4, flexDirection: 'row', alignItems: 'flex-end' }
          ]}
        >
          <Text
            style={{
              width: 80,
              textDecorationLine: disabled ? 'none' : 'underline',
              textAlign: 'right',
              ...labelStyle
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={{ width: 30 }}>
            {!!paymentsIds?.length && (
              <Text
                style={[
                  gStyles.helper,
                  { textAlign: 'center', textAlignVertical: 'bottom' }
                ]}
              >{`(${paymentsIds?.length})`}</Text>
            )}
          </View>
        </View>
      </Pressable>
      <CurrencyAmount style={styles.amount} amount={amount} />
    </View>
  )
}

export default BalanceAmounts

export const BalanceAmountsE = (props: BalanceAmountsProps) => (
  <ErrorBoundary componentName="BalanceAmounts">
    <BalanceAmounts {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({
  totals: {
    justifyContent: 'flex-end',
    flex: 1,
    margin: 'auto',
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2
  },
  label: {
    width: 80,
    textAlign: 'right'
  },
  amount: {
    textAlign: 'right',
    width: 90
  }
})
