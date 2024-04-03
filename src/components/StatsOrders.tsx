import { useStore } from '../contexts/storeContext'
import {
  createDataset,
  groupDocsByMonth,
  groupDocsByType,
  groupDocsByWeek,
  weekLabels
} from '../libs/chart-data'
import { months } from '../libs/utils-date'
import LineChart from './LineChart'
import theme, { ORDER_TYPE_COLOR } from '../theme'
import OrderType from '../types/OrderType'
import dictionary from '../dictionary'

export default function StatsOrders({ view }: { view: string }) {
  const { orders } = useStore()

  return (
    <>
      {view === 'month' && <MonthStats orders={orders} />}
      {view === 'week' && <WeekStats orders={orders} />}
    </>
  )
}

const MonthStats = ({ orders }: { orders: OrderType[] }) => {
  const sortMonths = (a: string, b: string) =>
    months.indexOf(a) - months.indexOf(b)

  //* DATA SET FOR MONTHS
  const ordersByMonth = groupDocsByMonth({ docs: orders })
  const ordersByType = groupDocsByType({ docs: orders })
  const ordersLabels = Object.keys(ordersByMonth).sort(sortMonths)

  const orderTypeDatasets = Object.entries(ordersByType).map(
    ([type, orders]) => {
      const ordersByMonth = groupDocsByMonth({ docs: orders })

      return createDataset({
        label: dictionary(type as OrderType['type']),
        color: ORDER_TYPE_COLOR[type],
        docs: ordersByMonth,
        labels: ordersLabels
      })
    }
  )
  const allOrders = createDataset<OrderType>({
    label: 'Todas las ordenes',
    color: theme.info,
    docs: ordersByMonth,
    labels: ordersLabels
  })
  return (
    <LineChart
      title="Ordenes"
      labels={ordersLabels}
      datasets={[allOrders, ...orderTypeDatasets]}
    />
  )
}

const WeekStats = ({ orders }: { orders: OrderType[] }) => {
  const ordersByType = groupDocsByType({ docs: orders })
  const ordersByWeek = groupDocsByWeek({ docs: orders })
  const orderTypeDatasetsForWeeks = Object.entries(ordersByType).map(
    ([type, orders]) => {
      const weeks = groupDocsByWeek({ docs: orders })
      const labelsWeeks = Object.keys(ordersByWeek)
      return createDataset({
        label: dictionary(type as OrderType['type']),
        color: ORDER_TYPE_COLOR[type],
        docs: weeks,
        labels: labelsWeeks
      })
    }
  )
  //* create labels more Readable with month number and month
  const orderWeekLabels = weekLabels(Object.keys(ordersByWeek).map(Number))

  const allWeekOrders = createDataset<OrderType>({
    label: 'Todas las ordenes',
    color: theme.info,
    docs: ordersByWeek,
    labels: Object.keys(ordersByWeek)
  })
  return (
    <LineChart
      title="Ordenes"
      labels={orderWeekLabels}
      datasets={[allWeekOrders, ...orderTypeDatasetsForWeeks]}
    />
  )
}
