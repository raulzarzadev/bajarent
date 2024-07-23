const labels = {
  canceled: 'Cancelada',
  pending: 'Pendiente',
  finished: 'Finalizada',
  'in-progress': 'En curso',
  taken: 'En uso',
  expired: 'Por recoger',
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
  AUTHORIZED: 'Pedido',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
  REPORT: 'Reporte',
  REPORTED: 'Reportada',
  comment: 'comentario',
  report: 'reporte',
  PICKUP: 'recogida',
  EXPIRED: 'Por recoger',
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
  REPAIRED: 'Reparada',
  REPAIR_DELIVERED: 'Entregada',
  EXPIRE_TODAY: 'Por recoger',
  EXPIRED_TOMORROW: 'Por recoger',
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
  PICKED_UP: 'Recogida',
  true: 'Sí',
  false: 'No',
  REPAIR_START: 'Iniciar rep',
  REPAIR_FINISH: 'Terminar rep',
  AUTHORIZE: 'Autorizar',
  DELIVER: 'Entregar',
  RENEW: 'Renovar',
  COMMENT: 'Comentar',
  Authorize: 'Autorizar',
  Deliver: 'Entregar',
  Pickup: 'Recoger',
  Renew: 'Renovar',
  Repair: 'Reparación',
  'Repair start': 'Iniciar rep',
  'Repair finish': 'Terminar rep',
  /* ********************************************
   * PERMISSIONS ORDERS V2
   *******************************************rz */
  canCreate: 'Crear', // Added meaning in Spanish
  canViewAll: 'Consolidadas',
  canViewMy: 'Mis ordenes',
  canEdit: 'Editar',
  canDelete: 'Eliminar',
  canAssign: 'Asignar',
  canAuthorize: 'Autorizar',
  canRenew: 'Renovar',
  canCancel: 'Cancelar',
  canPickup: 'Recoger',
  canDelivery: 'Entregar',
  canStartRepair: 'Iniciar rep',
  canFinishRepair: 'Terminar rep',
  canSentWS: 'Enviar WS',
  canReorder: 'Pedir de nuevo',
  canUnAuthorize: 'Desautorizar',
  canUndo: 'Deshacer',
  showOrderTotal: 'Monto total',
  showOrderTime: 'Tiempo',
  getExpireTomorrow: 'Vence mañana',
  /* ********************************************
   * PERMISSIONS STORE V2
   *******************************************rz */
  canCreateBalance: 'Crear balance',
  canViewBalances: 'Ver balances',
  canDeleteBalances: 'Eliminar balances',
  canSaveBalances: 'Guardar balances',
  canEditStaff: 'Editar staff',
  canCancelPayments: 'Cancelar pagos',
  canValidatePayments: 'Validar pagos',
  canManageItems: 'Administrar artículos',

  /* ********************************************
   * OTHERS
   *******************************************rz */
  type: 'Tipo',
  fullName: 'Nombre',
  phone: 'Teléfono',
  scheduledAt: 'Fecha',
  address: 'Dirección',
  location: 'Ubicación',
  neighborhood: 'Colonia',
  references: 'Referencias',
  selectItemRepair: 'Item a reparar',
  selectItemRent: 'Item a rentar',
  selectItems: 'Seleccionar items',
  repairDescription: 'Descripción de rep.',
  itemBrand: 'Marca',
  itemSerial: 'Serie',
  imageID: 'Identificación',
  imageHouse: 'Fachada',
  hasDelivered: 'Ya entregado',
  assignIt: 'Asignar',
  sheetRow: 'Fila Excel',
  note: 'Nota',
  selectItemsRepair: 'Items en reparación',
  selectItemsRent: 'Items en renta',
  selectItemsSale: 'Items en venta',
  canViewCashbox: 'Ver caja',
  canViewItems: 'Ver Items',
  canExtend: 'Extender',
  green: 'verde',
  red: 'rojo',
  yellow: 'amarillo',
  blue: 'azul',
  lightBlue: 'azul claro',
  darkBlue: 'azul oscuro',
  gray: 'gris',
  lightGray: 'gris claro',
  darkGray: 'gris oscuro',
  black: 'negro',
  white: 'blanco',
  transparent: 'transparente',
  purple: 'morado',
  orange: 'naranja',
  indigo: 'índigo',
  teal: 'verde azulado',
  cyan: 'cian',
  lime: 'lima',
  amber: 'ámbar',
  emerald: 'esmeralda',
  lightPink: 'rosa claro',
  lightPurple: 'morado claro',
  rented: 'en renta',
  maintenance: 'en mantenimiento',
  sold: 'vendido',
  stock: 'en bodega',
  pickedUp: 'recogido',
  important: 'importante',
  delivery: 'entrega',
  pickup: 'recoger',
  fix: 'reparación',
  assignment: 'Asignación',
  created: 'Creada',
  exchange: 'cambio',
  reactivate: 'habilitar',
  bonus: 'bono',
  expense: 'gasto',
  'item-movement': 'Artículo MV',
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

export const asCapitalize = (string: string) => {
  if (!string) return ''
  return string?.charAt(0)?.toUpperCase() + string.slice(1)
}

export default dictionary
