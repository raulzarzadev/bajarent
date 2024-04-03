import { View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import { createDataset, groupDocsByMonth } from '../libs/chart-data'
import { months } from '../libs/utils-date'
import LineChart from './LineChart'
import theme from '../theme'

export default function StatsReports() {
  const { comments } = useStore()
  const commentsByMonths = groupDocsByMonth({ docs: comments })
  const commentsSolvedByMonths = groupDocsByMonth({
    docs: comments.filter((c) => c.solved)
  })
  const reportLabels = Object.keys(commentsByMonths).sort(
    (a, b) => months.indexOf(a) - months.indexOf(b)
  )

  const reportsByMonths = createDataset({
    label: 'Reportes',
    color: theme.error,
    docs: commentsByMonths,
    labels: reportLabels
  })

  const reportsSolved = createDataset({
    label: 'Reportes resueltos',
    color: theme.primary,
    docs: commentsSolvedByMonths,
    labels: reportLabels
  })
  return (
    <LineChart
      title="Reportes"
      labels={reportLabels}
      datasets={[reportsByMonths, reportsSolved]}
    />
  )
}
