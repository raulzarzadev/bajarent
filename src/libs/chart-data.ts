import { Timestamp } from 'firebase/firestore'
import asDate, { dateFormat } from './utils-date'
import groupBy from './groupBy'
import { endOfWeek, getDayOfYear, setWeek, startOfWeek } from 'date-fns'

export type ChartDocType<T> = T & { createdAt: Date | Timestamp }

export const groupDocsByMonth = <T extends { createdAt: Date | Timestamp }>({
  docs
}: {
  docs: ChartDocType<T>[]
}) => {
  const groupedOrdersByMonth: { [key: string]: ChartDocType<T>[] } =
    docs.reduce((acc, doc) => {
      const monthYear = dateFormat(asDate(doc.createdAt), 'MMMM')
      if (acc[monthYear]) {
        acc[monthYear].push(doc)
      } else {
        acc[monthYear] = [doc]
      }
      return acc
    }, {})
  return groupedOrdersByMonth
}

export const groupDocsByWeek = <T extends { createdAt: Date | Timestamp }>({
  docs
}: {
  docs: ChartDocType<T>[]
}) => {
  const groupedOrdersByWeek: { [key: string]: ChartDocType<T>[] } = docs.reduce(
    (acc, doc) => {
      const date = asDate(doc.createdAt)
      const week = dateFormat(date, 'w')
      if (acc[week]) {
        acc[week].push(doc)
      } else {
        acc[week] = [doc]
      }
      return acc
    },
    {}
  )
  return groupedOrdersByWeek
}

export const groupDocsByDay = <T extends { createdAt: Date | Timestamp }>({
  docs
}: {
  docs: ChartDocType<T>[]
}) => {
  const groupedOrdersByDay: { [key: string]: ChartDocType<T>[] } = docs.reduce(
    (acc, doc) => {
      const date = asDate(doc.createdAt)
      const day = getDayOfYear(date)
      if (acc[day]) {
        acc[day].push(doc)
      } else {
        acc[day] = [doc]
      }
      return acc
    },
    {}
  )
  return groupedOrdersByDay
}

export const groupDocsByType = <T extends { type: string }>({
  docs
}: {
  docs: T[]
}) => {
  const groupedOrdersByType = groupBy(docs, (doc) => doc.type)

  return groupedOrdersByType
}

export const weekLabels = (weeks: number[]) =>
  Object.keys(weeks)
    .sort()
    .map((week) => {
      const date = new Date()
      const newDate = setWeek(date, parseInt(week))
      const weekStarts = startOfWeek(newDate, { weekStartsOn: 1 })
      const weekEnds = endOfWeek(newDate, { weekStartsOn: 1 })
      return `${dateFormat(weekStarts, 'd')}-${dateFormat(weekEnds, 'd MMM')}`
    })

/**
 *
 * @param label name of the row
 * @param color color of the row
 * @param labels order of the data
 * @param docs data to be displayed
 * @returns
 */
export const createDataset = <T>({
  label,
  color,
  labels,
  docs
}: {
  label: string
  color: string
  labels: string[] // here you define the order of how data will be displayed
  docs: Record<string, T[]>
}): {
  label: string
  data: number[]
  color: string
} => {
  const data = labels.map((label) => docs[label]?.length || 0)
  return {
    label,
    data,
    color
  }
}
