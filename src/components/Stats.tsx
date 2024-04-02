import { ScrollView } from 'react-native'
import { useStore } from '../contexts/storeContext'
import {
  createDataset,
  groupDocsByMonth,
  groupDocsByType
} from '../libs/chart-data'
import theme, { ORDER_TYPE_COLOR } from '../theme'
import LineChart from './LineChart'
import OrderType from '../types/OrderType'

export default function Stats() {
  const { orders, comments } = useStore()

  const ordersByMonth = groupDocsByMonth({ docs: orders })
  const ordersByType = groupDocsByType({ docs: orders })

  const orderTypeDatasets = Object.entries(ordersByType).map(
    ([type, orders]) => {
      const ordersByMonth = groupDocsByMonth({ docs: orders })
      return createDataset({
        label: type,
        color: ORDER_TYPE_COLOR[type],
        docs: ordersByMonth,
        labels: Object.keys(ordersByMonth)
      })
    }
  )
  const allOrders = createDataset<OrderType>({
    label: 'Todas las ordenes',
    color: theme.info,
    docs: ordersByMonth,
    labels: Object.keys(ordersByMonth)
  })

  const reports = createDataset({
    label: 'Reportes',
    color: theme.error,
    docs: groupDocsByMonth({ docs: comments }),
    labels: Object.keys(ordersByMonth)
  })
  const reportsSolved = createDataset({
    label: 'Reportes',
    color: theme.primary,
    docs: groupDocsByMonth({ docs: comments.filter((c) => c.solved) }),
    labels: Object.keys(ordersByMonth)
  })

  return (
    <ScrollView>
      <LineChart
        title="Ordenes"
        labels={Object.keys(ordersByMonth).sort()}
        datasets={[allOrders, ...orderTypeDatasets]}
      />
      <LineChart
        title="Reportes"
        labels={Object.keys(reports).sort()}
        datasets={[reports, reportsSolved]}
      />
    </ScrollView>
  )
}
