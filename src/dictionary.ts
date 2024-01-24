const labels = {
  canceled: 'Cancelada',
  pending: 'Pendiente',
  finished: 'Finalizada',
  'in-progress': 'En curso',
  taken: 'En uso',
  expired: 'Vencida',
  expire: 'Vence',
  hour: 'hora',
  day: 'día',
  week: 'semana',
  month: 'mes',
  year: 'año',
  second: 'segundo',
  seconds: 'segundos',
  minute: 'minuto',
  minutes: 'minutos',
  hours: 'horas',
  days: 'días',
  weeks: 'semanas',
  months: 'meses',
  years: 'años',
  mxn: 'efectivo',
  usd: 'dolar',
  card: 'tarjeta',
  deposit: 'depósito',
  renewed: 'Renovada',
  renew: 'Renovar',
  free: 'libre',
  available: 'disponible',
  PENDING: 'Pendiente',
  AUTHORIZED: 'Autorizada',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
  REPORT: 'Reporte',
  REPORTED: 'Reportada',
  comment: 'comentario',
  report: 'reporte',
  '': ''
} as const
export type Labels = keyof typeof labels
const dictionary = (value: Labels) => {
  if (!labels[value]) return value
  return labels[value]
}

export default dictionary
