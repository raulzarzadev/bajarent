import { Timestamp } from 'firebase/firestore'
import {
  endOfWeek,
  format as fnsFormat,
  formatDistanceToNowStrict,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfWeek,
  subWeeks
} from 'date-fns'
import { es } from 'date-fns/locale'

export const weekDays = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sabado'
}

export const dateMx = (date?: Date | Timestamp | null) => {
  if (!date) return '-'
  const value = date instanceof Timestamp ? date.toDate() : date
  return new Intl.DateTimeFormat(['es-Mx']).format(value)
}

export const dateFormat = (
  date?: number | Date | Timestamp | null,
  strFormat?: string,
  returnNullIfInvalid = false
): string => {
  if (!date && returnNullIfInvalid) return null
  if (!date) return '' //* not a date
  const value = date instanceof Timestamp ? date.toDate() : date
  const res = fnsFormat(value, strFormat || 'dd/MMM/yy', {
    locale: es
  })
  return res
}

const customLocale = {
  ...es,
  formatDistance: (
    token: string,
    count: number,
    options?: { addSuffix?: boolean; comparison?: number }
  ) => {
    const units = {
      xSeconds: 's',
      xMinutes: 'm',
      xHours: 'h',
      xDays: 'd',
      xWeeks: 'S',
      xMonths: 'M',
      xYears: 'A'
    }
    const unit = units[token]
    if (!unit) {
      throw new Error(`Invalid time unit: ${token}`)
    }
    const days = count * options.comparison
    return options?.addSuffix
      ? days < 0
        ? 'hace ' + count + ' ' + unit
        : 'en ' + count + ' ' + unit
      : count + unit
  }
}

export const fromNow = (date?: number | Date | Timestamp | null) => {
  const validDate = asDate(date)
  if (!validDate) return '-'
  const res = formatDistanceToNowStrict(validDate, {
    locale: customLocale,
    addSuffix: true,
    roundingMethod: 'round'
  })
  return res
}

export const inputDateFormat = (
  date: Date | Timestamp | string | number = new Date()
) => dateFormat(asDate(date), "yyyy-MM-dd'T'HH:mm")

export const asDate = (
  date?: Timestamp | Date | number | string | object | null
): Date | null => {
  if (!date) return null
  if (date instanceof Date) {
    if (!isNaN(date.getTime())) return date
    console.error('not a valid date', { date })
    return null
  }
  if (date instanceof Timestamp) return date.toDate()
  if (typeof date === 'number') return new Date(date)
  if (typeof date === 'string') {
    const newDate = new Date(date)
    if (newDate.getTime()) return newDate
  }
  console.error('not a valid date', { date })
  return null
}
export default asDate

export function isLastWeek(date) {
  const lastWeek = {
    start: startOfWeek(subWeeks(new Date(), 1)),
    end: endOfWeek(subWeeks(new Date(), 1))
  }

  return isWithinInterval(date, lastWeek)
}

export const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre'
]

export function isAfterTomorrow(date: Date): boolean {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return isAfter(date, tomorrow)
}
export function isBeforeYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isBefore(date, yesterday)
}

export function endDate(date: Date): Date {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}
export function startDate(date: Date): Date {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}
