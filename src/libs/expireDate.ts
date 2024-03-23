import { Timestamp } from 'firebase/firestore'
import asDate from './utils-date'
import { PriceType, TimePriceType } from '../types/PriceType'
import { addDays, addHours, addMinutes, addMonths, addWeeks } from 'date-fns'
/**
 *
 * @param time its a string with the time and the unit of time
 * @returns the time in seconds
 */
export function priceTimeInSeconds(time: TimePriceType): number {
  const timeArray = time.split(' ')
  const timeNumber = parseInt(timeArray[0])
  const timeUnit = timeArray[1]
  const units = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2628000,
    year: 31536000
  }
  return timeNumber * units[timeUnit]
}

export default function expireDate(
  time: TimePriceType,
  startedAt: Date | Timestamp,
  price?: PriceType
): Date {
  console.log({ startedAt })
  if (!price) return startedAt as Date
  const startedAtDate = asDate(startedAt)
  const [qty, unit] = price.time.split(' ')
  const QTY = parseInt(qty)
  if (unit === 'year') {
    const expireDate = addMonths(startedAtDate, QTY * 12)
    return expireDate
  }
  if (unit === 'hour') {
    const expireDate = addHours(startedAtDate, QTY)
    return expireDate
  }
  if (unit === 'minute') {
    const expireDate = addMinutes(startedAtDate, QTY)

    return expireDate
  }
  if (unit === 'month') {
    const expireDate = addMonths(startedAtDate, QTY)
    return expireDate
  }
  if (unit === 'week') {
    const expireDate = addWeeks(startedAtDate, QTY)
    return expireDate
  }
  if (unit === 'day') {
    const expireDate = addDays(startedAtDate, QTY)
    return expireDate
  }
  console.error('dont unit match')
  // if time does not exist return null
  if (!time || !startedAt) return null
  // if time does not have a number return null

  if (!startedAtDate) return null
  const timeInSeconds = priceTimeInSeconds(time)

  const expireDate = new Date(
    asDate(startedAt)?.getTime() + timeInSeconds * 1000
  )
  return expireDate
}
