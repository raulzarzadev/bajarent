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
  DELIVERED: 'En renta',
  CANCELLED: 'Cancelada',
  REPORT: 'Reporte',
  REPORTED: 'Reportada',
  comment: 'comentario',
  report: 'reporte',
  PICKUP: 'recogida',
  EXPIRED: 'Vencida',
  RENEWED: 'Renovada',
  isAdmin: 'Administrador',
  canDeliveryOrder: 'Entregar Orden',
  canCancelOrder: 'Cancelar Orden',
  canAuthorizeOrder: 'Autorizar Orden',
  canEditOrder: 'Editar orden',
  canAssignOrder: 'Asignar Orden',
  canRenewOrder: 'Renovar Orden',
  canCreateOrder: 'Crear Orden',
  canDeleteOrder: 'Eliminar Orden',
  canPickupOrder: 'Recoger Orden',
  canViewMyOrders: 'Ver mis Ordenes',
  canViewOrders: 'Ver Ordenes',
  canRepairOrder: 'Reparar Orden',
  REPAIR: 'Reparación',
  REPAIRING: 'Reparando',
  REPAIRED: 'Terminada',
  REPAIR_DELIVERED: 'Entregada',
  RENT: 'Renta',
  SALE: 'Venta',
  cash: 'efectivo',
  transfer: 'Transferencia',
  full: 'Completa',
  partial: 'Parcial',
  hasNotSolvedReports: 'Reportes no resueltos',
  STORE_RENT: 'Renta local',
  DELIVERY_RENT: 'Renta a domicilio',
  DELIVERY_SALE: 'Venta a domicilio',
  MULTI_RENT: 'Renta múltiple',
  true: 'Sí',
  false: 'No',
  REPAIR_START: 'Iniciar reparación',
  REPAIR_FINISH: 'Terminar reparación',
  AUTHORIZE: 'Autorizar',
  DELIVER: 'Entregar',
  RENEW: 'Renovar',
  COMMENT: 'Comentar',
  Authorize: 'Autorizar',
  Deliver: 'Entregar',
  Pickup: 'Recoger',
  Renew: 'Renovar',
  Repair: 'Reparar',
  'Repair start': 'Iniciar reparación',
  'Repair finish': 'Terminar reparación',

  ' ': '',
  '': ''
} as const
const labels_lowercase = Object.keys(labels).reduce((acc, key) => {
  const lowerKey = key.toLowerCase()
  const lowerValue = labels[key].toLowerCase()
  acc[lowerKey] = lowerValue
  return acc
}, {} as Record<string, string>)

export type Labels = keyof typeof labels_lowercase

const dictionary = (value: Labels) => {
  if (!labels[value] || value === ' ') return value
  const lowerValue = value.toLowerCase()
  return labels_lowercase[lowerValue]
}

export default dictionary
