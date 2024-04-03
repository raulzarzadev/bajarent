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
import { CommentType } from '../types/CommentType'
import dictionary from '../dictionary'

export default function StatsReports({ view }: { view: string }) {
  const { comments } = useStore()
  return (
    <>
      {view === 'month' && <MonthStats comments={comments} />}
      {view === 'week' && <WeekStats comments={comments} />}
    </>
  )
}

const MonthStats = ({ comments }) => {
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

const WeekStats = ({ comments }: { comments: CommentType[] }) => {
  const commentsByWeeks = groupDocsByWeek({ docs: comments })
  const commentsSolvedByWeeks = groupDocsByWeek({
    docs: comments.filter((c) => c.solved)
  })

  const reportLabels = Object.keys(commentsByWeeks).sort(
    (a, b) => months.indexOf(a) - months.indexOf(b)
  )

  const reportsByMonths = createDataset({
    label: 'Reportes',
    color: theme.error,
    docs: commentsByWeeks,
    labels: reportLabels
  })

  const reportsSolved = createDataset({
    label: 'Reportes resueltos',
    color: theme.primary,
    docs: commentsSolvedByWeeks,
    labels: reportLabels
  })
  const orderWeekLabels = weekLabels(Object.keys(commentsByWeeks).map(Number))
  return (
    <LineChart
      title="Reportes"
      labels={orderWeekLabels}
      datasets={[reportsByMonths, reportsSolved]}
    />
  )
}

// const WeekStats = ({ comments }) => {
//   const commentsByWeeks = groupDocsByWeek({ docs: comments })
//   const commentsSolvedByWeeks = groupDocsByWeek({
//     docs: comments.filter((c) => c.solved)
//   })

//   const reportLabels = weekLabels(Object.keys(commentsByWeeks).map(Number))

//   const reportsByWeeks = createDataset({
//     label: 'Reportes',
//     color: theme.error,
//     docs: commentsByWeeks,
//     labels: reportLabels
//   })

//   const reportsSolved = createDataset({
//     label: 'Reportes resueltos',
//     color: theme.primary,
//     docs: commentsSolvedByWeeks,
//     labels: reportLabels
//   })
//   return (
//     <LineChart
//       title="Reportes"
//       labels={reportLabels}
//       datasets={[reportsByWeeks, reportsSolved]}
//     />
//   )
// }
