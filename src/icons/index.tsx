// * -----> https://allsvgicons.com/search/ <--- *//
import IconAdd from './icon-add'
import IconAddImage from './icon-add-image'
import IconAlarm from './icon-alarm'
import IconAlarmOff from './icon-alarm-off'
import IconArrowForward from './icon-arrow-forward'
import IconBackup from './icon-backup'
import IconBalance from './icon-balance'
import IconBroom from './icon-broom'
import IconCalendar from './icon-calendar'
import IconCalendarTime from './icon-calendar-time'
import IconCamera from './icon-camera'
import IconCancel from './icon-cancel'
import IconCashbox from './icon-cashbox'
import IconChargeIt from './icon-charge-it'
import IconChatbot from './icon-chatbot'
import IconClose from './icon-close'
import IconComment from './icon-comment'
import IconComponents from './icon-components'
import IconContract from './icon-contract'
import IconCopy from './icon-copy'
import IconCustomerCard from './icon-customer-card'
import IconDelete from './icon-delete'
import IconDone from './icon-done'
import IconDownload from './icon-download'
import IconEdit from './icon-edit'
import IconEmail from './icon-email'
import IconFilter from './icon-filter'
import IconFolderCheck from './icon-folder-check'
import IconHistory from './icon-history'
import IconHome from './icon-home'
import IconInfo from './icon-info'
import IconInventory from './icon-inventory'
import IconList from './icon-list'
import IconLocation from './icon-location'
import IconLocationOff from './icon-location-off'
import IconMap from './icon-map'
import IconMerge from './icon-merge'
import IconMoney from './icon-money'
import IconMoneyOff from './icon-money-off'
import IconMyOrders from './icon-my-orders'
import IconNavigate from './icon-navigate'
import IconOpenEye from './icon-open-eye'
import IconOrder from './icon-order'
import IconOrderAdd from './icon-order-add'
import IconOrderDone from './icon-order-done'
import IconOrderEdit from './icon-order-edit'
import IconOrderGo from './icon-order-go'
import IconOrderList from './icon-order-list'
import IconOrderRemove from './icon-order-remove'
import IconOrderSearch from './icon-order-search'
import IconOrders from './icon-orders'
import IconPayment from './icon-payment'
import IconPdf from './icon-pdf'
import IconPending from './icon-pending'
import IconPhone from './icon-phone'
import IconPickUpIt from './icon-pick-up-it'
import IconPin from './icon-pin'
import IconProfile from './icon-profile'
import IconProfileAdd from './icon-profile-add'
import IconProfileFill from './icon-profile-fill'
import IconRefresh from './icon-refresh'
import IconRent from './icon-rent'
import IconRowDown from './icon-row-down'
import IconRowLeft from './icon-row-left'
import IconRowRight from './icon-row-right'
import IconRowUp from './icon-row-up'
import IconSale from './icon-sale'
import IconSave from './icon-save'
import IconSearch from './icon-search'
import IconSettings from './icon-settings'
import IconSignature from './icon-signature'
import IconSiren from './icon-siren'
import IconStarEmpty from './icon-star-empty'
import IconStarFilled from './icon-star-filled'
import IconStarHalf from './icon-star-half'
import IconStore from './icon-store'
import IconSub from './icon-sub'
import IconSwap from './icon-swap'
import IconTarget from './icon-target'
import IconTools from './icon-tools'
import IconTruck from './icon-truck'
import IconUndo from './icon-undo'
import IconUnpin from './icon-unpin'
import IconUp from './icon-up'
import IconUpload from './icon-upload'
import IconVerticalDots from './icon-vertical-dots'
import IconWarehouse from './icon-warehouse'
import IconWarning from './icon-warning'
import IconWashMachine from './icon-wash-machine'
import IconWhatsapp from './icon-whatsapp'
import IconWindows from './icon-windows'
import IconWrench from './icon-wrench'
import IconWww from './icon-www'

const icons = {
  filePDF: IconPdf,
  navigate: IconNavigate,
  folderCheck: IconFolderCheck,
  merge: IconMerge,
  orderAdd: IconOrderAdd,
  orderDone: IconOrderDone,
  orderSearch: IconOrderSearch,
  orderEdit: IconOrderEdit,
  orderGo: IconOrderGo,
  orderList: IconOrderList,
  order: IconOrder,
  orderRemove: IconOrderRemove,
  contract: IconContract,
  email: IconEmail,
  customerCard: IconCustomerCard,
  backup: IconBackup,
  balance: IconBalance,
  www: IconWww,
  signature: IconSignature,
  pending: IconPending,
  pickUpIt: IconPickUpIt,
  chargeIt: IconChargeIt,
  washMachine: IconWashMachine,
  inventory: IconInventory,
  history: IconHistory,
  alarm: IconAlarm,
  alarmOff: IconAlarmOff,
  rent: IconRent,
  cashbox: IconCashbox,
  up: IconUp,
  down: IconRowDown,
  close: IconClose,
  store: IconStore,
  orders: IconOrders,
  profile: IconProfile,
  profileFill: IconProfileFill,
  profileAdd: IconProfileAdd,
  components: IconComponents,
  myOrders: IconMyOrders,
  list: IconList,
  add: IconAdd,
  edit: IconEdit,
  money: IconMoney,
  moneyOff: IconMoneyOff,
  save: IconSave,
  location: IconLocation,
  locationOff: IconLocationOff,
  filter: IconFilter,
  windows: IconWindows,
  broom: IconBroom,
  swap: IconSwap,
  delete: IconDelete,
  search: IconSearch,
  map: IconMap,
  calendar: IconCalendar,
  verticalDots: IconVerticalDots,
  sub: IconSub,
  phone: IconPhone,
  whatsapp: IconWhatsapp,
  done: IconDone,
  rowLeft: IconRowLeft,
  rowRight: IconRowRight,
  rowDown: IconRowDown,
  rowUp: IconRowUp,
  settings: IconSettings,
  download: IconDownload,
  upload: IconUpload,
  camera: IconCamera,
  addImage: IconAddImage,
  info: IconInfo,
  warning: IconWarning,
  undo: IconUndo,
  cancel: IconCancel,
  refresh: IconRefresh,
  copy: IconCopy,
  arrowForward: IconArrowForward,
  openEye: IconOpenEye,
  pin: IconPin,
  unPin: IconUnpin,
  repair: IconWrench,
  sale: IconSale,
  wrench: IconWrench,
  truck: IconTruck,
  home: IconHome,
  calendarTime: IconCalendarTime,
  siren: IconSiren,
  report: IconSiren,
  payment: IconPayment,
  starFilled: IconStarFilled,
  starHalf: IconStarHalf,
  starEmpty: IconStarEmpty,
  target: IconTarget,
  tools: IconTools,
  comment: IconComment,
  warehouse: IconWarehouse,
  none: null,
  chatbot: IconChatbot,
  pencil: IconEdit,
  menuDown: IconArrowForward
} as const

export type IconName = keyof typeof icons
const Icon2 = ({
  name,
  size = 30,
  ...props
}: {
  name: IconName | 'none'
  color?: string
  size?: number
}) => {
  if (name === 'none') return null
  const Component = icons[name]
  if (!Component) return <>Icon</>
  return <Component size={size} {...props} style={{ fontSize: size }} />
}
export default Icon2
