import { useStore } from '../contexts/storeContext'
import { generateChartData } from '../libs/chart-data'
import theme from '../theme'
import LineChart from './LineChart'

export default function Stats() {
  const { orders } = useStore()
  const data = generateChartData(orders)
  console.log({ data })
  return (
    <LineChart
      title="Ordenes"
      labels={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']}
      datasets={[
        {
          label: 'Rentas',
          data: [200, 230, 240, 290, 180, 170],
          color: theme.info
        },
        {
          label: 'Ventas',
          data: [50, 20, 40, 90, 80, 70],
          color: theme.neutral
        },
        {
          label: 'Reparaciones',
          data: [12, 16, 13, 18, 19, 14],
          color: theme.secondary
        }
      ]}
    />
  )
}
