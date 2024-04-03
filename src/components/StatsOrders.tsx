import { ScrollView } from 'react-native'
import { useStore } from '../contexts/storeContext'
import {
  createDataset,
  groupDocsByMonth,
  groupDocsByType
} from '../libs/chart-data'
import { months } from '../libs/utils-date'
import LineChart from './LineChart'
import theme, { ORDER_TYPE_COLOR } from '../theme'
import OrderType from '../types/OrderType'

export default function StatsOrders() {
  const { orders } = useStore()
  const sortMonths = (a: string, b: string) =>
    months.indexOf(a) - months.indexOf(b)
  const ordersByMonth = groupDocsByMonth({ docs: orders })
  const ordersByType = groupDocsByType({ docs: orders })
  const ordersLabels = Object.keys(ordersByMonth).sort(sortMonths)
  const orderTypeDatasets = Object.entries(ordersByType).map(
    ([type, orders]) => {
      const ordersByMonth = groupDocsByMonth({ docs: orders })
      return createDataset({
        label: type,
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
