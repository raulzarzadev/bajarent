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
import { order_type } from '../../types/OrderType'
import { useStore } from '../../contexts/storeContext'

export const BalanceView = ({ balance }: BalanceViewProps) => {
  const { sections } = useStore()
  const balanceCSV = generateBalanceCSV(balance, {
    sectionsNames: sections?.map((s) => ({
      sectionId: s.id,
      sectionName: s.name
    }))
  })
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

//#region generateBalanceCSV
const generateBalanceCSV = (
  balance: StoreBalanceType,
  {
    sectionsNames
  }: {
    sectionsNames: { sectionId: string; sectionName: string }[]
  }
) => {
  // Función auxiliar para formatear valores
  const formatDate = (date) => dateFormat(asDate(date), 'dd/MMM/yy HH:mm')
  const formatCurrency = (value) =>
    (value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const rentOrders = balance.orders.filter(
    (order) => order.orderType === order_type.RENT
  )
  const rentPayments = rentOrders.map((o) => o.payments).flat()

  const rentedItems = rentOrders.map((o) => o.items).flat()
  const unrentedItems = balance.items

  const rentedItemsCount = rentedItems.length
  const unrentedItemsCount = unrentedItems.length
  const rentedItemsEco = rentedItems
    .map((i) => i?.itemEco || '0')
    .sort((a, b) => parseInt(b) - parseInt(a))
    .join(',')
  const unrentedItemsEco = unrentedItems
    .map((i) => i?.itemEco || '0')
    .sort((a, b) => parseInt(b) - parseInt(a))
    .join(',')

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
  const JUM = `\n'` // SALTO DE LINEA

  // Encabezado con separación por tabulaciones
  let csv = ''
  csv += `Período ${JUM} ${formatDate(balance.fromDate)} - ${formatDate(
    balance.toDate
  )}${JUM}`
  csv += `Generado el ${JUM} ${formatDate(balance.createdAt)} ${JUM}`
  //#region  General
  csv += `RESUMEN GENERAL${JUM}`

  csv += `${JUM}CAJA${JUM}`
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

  //#region Rentas
  const rentAmounts = payments_amount(rentPayments)
  csv += `${JUM}RESUMEN RENTAS${JUM}`
  // Pagos de renta
  csv += `Ventas${JUM}${rentAmounts.incomes}${JUM}`
  csv += `Efectivo${JUM}${rentAmounts.cash}${JUM}`
  csv += `Tarjeta${JUM}${rentAmounts.card}${JUM}`
  csv += `Transferencias${JUM}${rentAmounts.transfers}${JUM}`
  csv += `Egresos${JUM}${rentAmounts.outcomes}${JUM}`
  csv += `Retiros${JUM}${rentAmounts.retirements}${JUM}`
  csv += `Bonificaciones${JUM}${rentAmounts.bonus}${JUM}`
  csv += `Gastos${JUM}${rentAmounts.expense}${JUM}`
  csv += `Total${JUM}${rentAmounts.total}${JUM}`
  csv += `Faltante${JUM}${rentAmounts.missing}${JUM}`
  csv += `Cancelados${JUM}${rentAmounts.canceled}${JUM}`
  // Encabezado de pagos de renta por área
  csv += `${JUM}${JUM}RESUMEN RENTAS POR AREA${JUM}${JUM}`
  //group by area
  const rentOrdersByArea = rentOrders.reduce((acc, order) => {
    const area = order.assignedSection || 'Sin área'
    acc[area] = acc[area] || []
    acc[area].push(order)
    return acc
  }, {})
  //#region areas
  Object.keys(rentOrdersByArea).forEach((area) => {
    const orders = rentOrdersByArea[area]
    const payments = orders.map((o) => o.payments).flat()
    const amounts = payments_amount(payments)
    csv += `${JUM}${
      sectionsNames
        ?.find((s) => s.sectionId === area)
        ?.sectionName?.toUpperCase() || ''
    }${JUM}`
    csv += `Ventas${JUM}${amounts.incomes}${JUM}`
    csv += `Efectivo${JUM}${amounts.cash}${JUM}`
    csv += `Tarjeta${JUM}${amounts.card}${JUM}`
    csv += `Transferencias
    ${JUM}${amounts.transfers}${JUM}`
    csv += `Egresos${JUM}${amounts.outcomes}${JUM}`
    csv += `Retiros${JUM}${amounts.retirements}${JUM}`
    csv += `Bonificaciones${JUM}${amounts.bonus}${JUM}`
    csv += `Gastos${JUM}${amounts.expense}${JUM}`
    csv += `Total${JUM}${amounts.total}${JUM}`
    csv += `Faltante${JUM}${amounts.missing}${JUM}`
    csv += `Cancelados${JUM}${amounts.canceled}${JUM}`
  })
  //#region items
  csv += `${JUM}ITEMS${JUM}`
  csv += `En renta${JUM}${rentedItemsCount}${JUM}${rentedItemsEco}${JUM}`
  csv += `Disponibles${JUM}${unrentedItemsCount}${JUM}${unrentedItemsEco}${JUM}`
  csv += `Total${JUM}${rentedItems.length + unrentedItems.length}${JUM}`
  return csv
}
