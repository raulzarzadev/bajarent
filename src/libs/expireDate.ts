import { Timestamp } from 'firebase/firestore'
import asDate, { dateFormat } from './utils-date'
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

/**
 *
 * @param time its a string with the time and the unit of time
 * @returns the time in seconds
 * @deprecated
 */
export default function expireDate(
  time: TimePriceType,
  startedAt: Date | Timestamp,
  price?: Partial<PriceType>,
  priceQty?: number
): Date {
  console.log({ time, startedAt, price, priceQty })
  if (!time) return null
  if (!price) return startedAt as Date

  const startedAtDate = asDate(startedAt)
  const [qty, unit] = price?.time?.split(' ') || ['', '']
  const QTY = parseInt(qty) * (priceQty || 1)
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

export function expireDate2({
  startedAt,
  price,
  priceQty,
  extendTime
}: {
  startedAt: Date | Timestamp
  price?: Partial<PriceType>
  priceQty?: number
  extendTime?: TimePriceType
}): Date | null {
  if (!price) return null
  if (!startedAt) return null
  const startedDate = asDate(startedAt)
  if (extendTime) {
    const expireDate = addCustomTime({ date: startedDate, time: price.time })
    return addCustomTime({ date: expireDate, time: extendTime })
  } else {
    return addCustomTime({ date: startedDate, time: price.time })
  }
}

export const addCustomTime = ({
  date,
  time,
  qty = 1
}: {
  date: Date
  time: TimePriceType
  qty?: number
}) => {
  const [amount, unit] = time?.split(' ') || ['', '']
  const QTY = parseInt(amount) * (qty || 1)
  if (unit === 'year') {
    const expireDate = addMonths(date, QTY * 12)
    return expireDate
  }
  if (unit === 'hour') {
    const expireDate = addHours(date, QTY)
    return expireDate
  }
  if (unit === 'minute') {
    const expireDate = addMinutes(date, QTY)

    return expireDate
  }
  if (unit === 'month') {
    const expireDate = addMonths(date, QTY)
    return expireDate
  }
  if (unit === 'week') {
    const expireDate = addWeeks(date, QTY)
    return expireDate
  }
  if (unit === 'day') {
    const expireDate = addDays(date, QTY)
    return expireDate
  }
  return null
}

export type LabelRentType = `${number} ${string}` | ''

export const translateTime = (
  time: TimePriceType,
  ops?: { shortLabel: boolean }
): LabelRentType => {
  const [amount, unit] = time?.split(' ') || ['', '']
  if (!time) return ''
  const units = {
    second: 'segundo',
    minute: 'minuto',
    hour: 'hora',
    day: 'día',
    week: 'semana',
    month: 'mes', //<-- this is meses
    year: 'año'
  }
  const shortUnits = {
    second: 's',
    minute: 'm',
    hour: 'h',
    day: 'd',
    week: 'S',
    month: 'M', //<-- this is meses
    year: 'A'
  }
  const amountNumber = parseInt(amount)
  let unitCount = amountNumber === 1 ? units[unit] : units[unit] + 's'
  if (ops?.shortLabel) {
    return `${amountNumber} ${shortUnits[unit]}`
  }
  if (unit === 'month') {
    return `${amountNumber} ${amountNumber === 1 ? 'mes' : 'meses'}`
  }
  return `${amountNumber} ${unitCount}`
}
