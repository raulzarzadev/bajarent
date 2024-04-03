import { useStore } from '../contexts/storeContext'
import {
  createDataset,
  groupDocsByDay,
  groupDocsByMonth,
  groupDocsByWeek,
  weekLabels
} from '../libs/chart-data'
import asDate, { dateFormat, months } from '../libs/utils-date'
import LineChart from './LineChart'
import theme from '../theme'
import { CommentType } from '../types/CommentType'
import { setDayOfYear } from 'date-fns'

export default function StatsReports({ view }: { view: string }) {
  const { comments } = useStore()
  return (
    <>
      {view === 'month' && <MonthStats comments={comments} />}
      {view === 'week' && <WeekStats comments={comments} />}
      {view === 'last30days' && <Last30DaysStats comments={comments} />}
      {view === 'last7days' && <Last7DaysStats comments={comments} />}
    </>
  )
}
const Last7DaysStats = ({ comments }) => {
  const last7Days = comments.filter((c) => {
    const date = asDate(c.createdAt)
    const today = new Date()
    const last7 = new Date(today.setDate(today.getDate() - 7))
    return date > last7
  })

  const commentsByMonths = groupDocsByDay({ docs: last7Days })
  const commentsSolvedByMonths = groupDocsByDay({
    docs: last7Days.filter((c) => c.solved)
  })

  const reportLabels = Object.keys(commentsByMonths).sort()

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
      labels={reportLabels.map((day) => {
        const date = setDayOfYear(new Date(), Number(day))
        return dateFormat(date, 'd MMM')
      })}
      datasets={[reportsByMonths, reportsSolved]}
    />
  )
}
const Last30DaysStats = ({ comments }) => {
  const last30Days = comments.filter((c) => {
    const date = asDate(c.createdAt)
    const today = new Date()
    const last30 = new Date(today.setDate(today.getDate() - 30))
    return date > last30
  })

  const commentsByMonths = groupDocsByDay({ docs: last30Days })
  const commentsSolvedByMonths = groupDocsByDay({
    docs: last30Days.filter((c) => c.solved)
  })

  const reportLabels = Object.keys(commentsByMonths).sort()

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
      labels={reportLabels.map((day) => {
        const date = setDayOfYear(new Date(), Number(day))
        return dateFormat(date, 'd MMM')
      })}
      datasets={[reportsByMonths, reportsSolved]}
    />
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
