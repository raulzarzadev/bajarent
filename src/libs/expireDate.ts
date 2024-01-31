import { Timestamp } from 'firebase/firestore'
import { TimePriceType } from '../types/RentItem'
import asDate from './utils-date'
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
  startedAt: Date | Timestamp
): Date {
  // if time does not exist return null
  if (!time || !startedAt) return null
  // if time does not have a number return null

  const startedAtDate = asDate(startedAt)
  if (!startedAtDate) return null
  const timeInSeconds = priceTimeInSeconds(time)

  const expireDate = new Date(
    asDate(startedAt)?.getTime() + timeInSeconds * 1000
  )
  return expireDate
}
