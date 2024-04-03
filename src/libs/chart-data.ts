import { Timestamp } from 'firebase/firestore'
import asDate, { dateFormat } from './utils-date'
import groupBy from './groupBy'

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

export const groupDocsByType = <T extends { type: string }>({
  docs
}: {
  docs: T[]
}) => {
  const groupedOrdersByType = groupBy(docs, (doc) => doc.type)

  return groupedOrdersByType
}

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
