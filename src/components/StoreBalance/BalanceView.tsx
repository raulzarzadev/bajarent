import { View, Text } from 'react-native'
import { gStyles } from '../../styles'
import { StoreBalanceType } from '../../types/StoreBalance'
import { GeneralBalanceE } from './GeneralBalance'
import { RentsBalanceE } from './RentsBalance'
import { RepairsBalanceE } from './RepairsBalance'
import { SalesBalanceE } from './SalesBalance'
import ErrorBoundary from '../ErrorBoundary'
import asDate, { dateFormat } from '../../libs/utils-date'
import Tabs from '../Tabs'
import SpanCopy from '../SpanCopy'
import { payments_amount } from '../../libs/payments'

export const BalanceView = ({ balance }: BalanceViewProps) => {
  const balanceCSV = generateBalanceCSV(balance)
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
      <SpanCopy copyValue={balanceCSV} />
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
export default BalanceView
export type BalanceViewProps = {
  balance: StoreBalanceType
}
export const BalanceViewE = (props: BalanceViewProps) => (
  <ErrorBoundary componentName="BalanceView">
    <BalanceView {...props} />
  </ErrorBoundary>
)

const generateBalanceCSV = (balance: StoreBalanceType) => {
  // Función auxiliar para formatear valores
  const formatDate = (date) => dateFormat(asDate(date), 'dd/MMM/yy HH:mm')
  const formatCurrency = (value) =>
    (value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const {
    bonus,
    expense,
    incomes,
    canceled,
    card,
    cash,
    total,
    missing,
    outcomes,
    retirements,
    transfers
  } = payments_amount(balance.payments)

  // Definir tabulación como separador
  const SPL = '\t' // SPLIT CELLS
  const JUM = '\n' // SALTO DE LINEA

  // Encabezado con separación por tabulaciones
  let csv = ''
  csv += `Período ${JUM} ${formatDate(balance.fromDate)} - ${formatDate(
    balance.toDate
  )}${JUM}`
  csv += `Generado el ${JUM} ${formatDate(balance.createdAt)} ${JUM}`
  // Sección General
  csv += `RESUMEN GENERAL${JUM}`
  csv += `Ventas${JUM}${incomes}${JUM}`
  csv += `Efectivo${JUM}${cash}${JUM}`
  csv += `Tarjeta${JUM}${card}${JUM}`
  csv += `Transferencias${JUM}${transfers}${JUM}`
  csv += `Egresos${JUM}${outcomes}${JUM}`
  csv += `Retiros${JUM}${retirements}${JUM}`
  csv += `Bonificaciones${JUM}${bonus}${JUM}`
  csv += `Gastos${JUM}${expense}${JUM}`
  csv += `Total${JUM}${total}${JUM}`
  csv += `Faltante${JUM}${missing}${JUM}`
  csv += `Cancelados${JUM}${canceled}${JUM}`

  return csv
}
