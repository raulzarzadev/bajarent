import { Timestamp } from 'firebase/firestore'
import {
  FormatDistanceToken,
  format as fnsFormat,
  formatDistanceToNowStrict
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
  strFormat?: string
): string => {
  if (!date) return 'n/d' //* not a date
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
    options?: { addSuffix?: boolean }
  ) => {
    switch (token) {
      case 'xSeconds':
        return options?.addSuffix
          ? count > 0
            ? 'hace ' + count + ' s'
            : 'en ' + count + ' s'
          : count + 'm'
      case 'xMinutes':
        return options?.addSuffix
          ? count > 0
            ? 'hace ' + count + ' m'
            : 'en ' + count + ' m'
          : count + 'm'
      case 'xHours':
        return options?.addSuffix
          ? count > 0
            ? 'hace ' + count + ' h'
            : 'en ' + count + ' h'
          : count + ' h'
      case 'xWeeks':
        return options?.addSuffix
          ? count > 0
            ? 'hace ' + count + ' s'
            : 'en ' + count + ' s'
          : count + ' s'
      case 'xMonths':
        return options?.addSuffix
          ? count > 0
            ? 'hace ' + count + ' M'
            : 'en ' + count + ' M'
          : count + ' M'
      default:
        return (
          es.formatDistance?.(token as FormatDistanceToken, count, options) ||
          ''
        )
    }
  }
}

export const fromNow = (date?: number | Date | Timestamp | null) => {
  const validDate = asDate(date)
  if (!validDate) return '-'
  const res = formatDistanceToNowStrict(validDate, {
    locale: customLocale,
    addSuffix: true,
    roundingMethod: 'ceil'
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
    console.error('not a valid date')
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
