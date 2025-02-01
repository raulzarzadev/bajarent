import { IoMdSwap, IoMdAdd } from 'react-icons/io'

import {
  MdEdit,
  MdClose,
  MdAttachMoney,
  MdSave,
  MdLocationPin,
  MdOutlineStorefront,
  MdListAlt,
  MdFilterList,
  MdDeleteOutline,
  MdOutlineSearch,
  MdLocationOff,
  MdOutlineDone,
  MdSettings,
  MdDownload,
  MdOutlinePhotoCamera,
  MdInfoOutline,
  MdWarningAmber,
  MdOutlineUndo,
  MdOutlineRefresh,
  MdCopyAll,
  MdUpload,
  MdOutlineArrowForward,
  MdOutlineRemoveRedEye,
  MdOutlineAlarm,
  MdOutlineTimerOff,
  MdOutlineStarBorder,
  MdOutlineStar,
  MdStarHalf,
  MdOutlineHistory,
  MdOutlineInventory,
  MdMyLocation,
  MdOutlineMailOutline
} from 'react-icons/md'
import { RiUnpinLine, RiPushpinLine } from 'react-icons/ri'
import { IoPricetagsOutline } from 'react-icons/io5'
import { FaAddressCard, FaTruckPickup } from 'react-icons/fa6'
import { LuCalendarClock } from 'react-icons/lu'
import { LuCalendar } from 'react-icons/lu'
import { MdOutlinePaid } from 'react-icons/md'

import {
  IoPersonOutline,
  IoPersonSharp,
  IoPersonAddOutline
} from 'react-icons/io5'
import { LuComponent } from 'react-icons/lu'
import { PiArrowFatLinesUpFill, PiUserList } from 'react-icons/pi'
import { FaRegWindowRestore } from 'react-icons/fa6'
import { FaChevronDown, FaChevronUp, FaTools } from 'react-icons/fa'
import { LiaBroomSolid } from 'react-icons/lia'
import { TbMapSearch } from 'react-icons/tb'
import { HiDotsVertical } from 'react-icons/hi'
import { GrFormSubtract } from 'react-icons/gr'
import { TiPhone } from 'react-icons/ti'
import { BsWhatsapp } from 'react-icons/bs'
import { RiImageAddLine } from 'react-icons/ri'
import { IoHammerOutline } from 'react-icons/io5'
import { FaWrench } from 'react-icons/fa6'
import { MdHome, MdMoneyOff } from 'react-icons/md'
import { FaCashRegister } from 'react-icons/fa'
import { FcCancel } from 'react-icons/fc'
import { RxLapTimer } from 'react-icons/rx'
import { PiSiren } from 'react-icons/pi'
import {
  GoChevronUp,
  GoChevronDown,
  GoChevronLeft,
  GoChevronRight
} from 'react-icons/go'
import { LiaToolsSolid } from 'react-icons/lia'
import { CgSmartHomeWashMachine } from 'react-icons/cg'
import { GiReceiveMoney } from 'react-icons/gi'
import { GoHomeFill } from 'react-icons/go'
import { MdPendingActions } from 'react-icons/md'
import { TfiWorld } from 'react-icons/tfi'
import { PiSignatureDuotone } from 'react-icons/pi'
import { BiCommentDots } from 'react-icons/bi'
import { FaBalanceScale } from 'react-icons/fa'
import { FaCloudDownloadAlt } from 'react-icons/fa'

import { LuClipboardPlus } from 'react-icons/lu'
import { LuClipboardPenLine } from 'react-icons/lu'
import { LuClipboardMinus } from 'react-icons/lu'
import { LuClipboardCheck } from 'react-icons/lu'
import { LuClipboard } from 'react-icons/lu'
import { LuClipboardList } from 'react-icons/lu'
import { LuClipboardPaste } from 'react-icons/lu'
import { TbClipboardSearch } from 'react-icons/tb'

// https://react-icons.github.io/react-icons/
const icons = {
  orderAdd: LuClipboardPlus,
  orderSearch: TbClipboardSearch,
  orderEdit: LuClipboardPenLine,
  orderGo: LuClipboardPaste,
  orderList: LuClipboardList,
  order: LuClipboard,
  orderDone: LuClipboardCheck,
  orderRemove: LuClipboardMinus,

  email: MdOutlineMailOutline,
  customerCard: FaAddressCard,
  backup: FaCloudDownloadAlt,
  balance: FaBalanceScale,
  www: TfiWorld,
  signature: PiSignatureDuotone,
  pending: MdPendingActions,
  pickUpIt: PiArrowFatLinesUpFill,
  chargeIt: GiReceiveMoney,
  washMachine: CgSmartHomeWashMachine,
  inventory: MdOutlineInventory,
  history: MdOutlineHistory,
  alarm: MdOutlineAlarm,
  alarmOff: MdOutlineTimerOff,
  rent: RxLapTimer,
  cashbox: FaCashRegister,
  up: FaChevronUp,
  down: FaChevronDown,
  close: MdClose,
  store: MdOutlineStorefront,
  orders: MdListAlt,
  profile: IoPersonOutline,
  profileFill: IoPersonSharp,
  profileAdd: IoPersonAddOutline,
  components: LuComponent,
  myOrders: PiUserList,
  list: MdListAlt,
  add: IoMdAdd,
  edit: MdEdit,
  money: MdAttachMoney,
  moneyOff: MdMoneyOff,
  save: MdSave,
  location: MdLocationPin,
  locationOff: MdLocationOff,
  filter: MdFilterList,
  windows: FaRegWindowRestore,
  broom: LiaBroomSolid,
  swap: IoMdSwap,
  delete: MdDeleteOutline,
  search: MdOutlineSearch,
  map: TbMapSearch,
  calendar: LuCalendar,
  verticalDots: HiDotsVertical,
  sub: GrFormSubtract,
  phone: TiPhone,
  whatsapp: BsWhatsapp,
  done: MdOutlineDone,
  // print: PrintIcon,
  // medicalInfo: MedicalInformationIcon,
  // restore: RestoreIcon,
  // favorite: FavoriteIcon,
  // archive: ArchiveIcon,
  // person: PersonIcon,
  // search: SearchIcon,
  // bike: DirectionsBikeIcon,
  // store: StoreIcon,
  // trash: DeleteForeverIcon,
  // delivery: LocalShippingIcon,
  // fix: BuildIcon,
  // settings: SettingsIcon,
  // sales: AttachMoneyIcon,
  // cashbox: PointOfSaleIcon,
  // substr: RemoveIcon,
  // eye: VisibilityIcon,
  // info: InfoIcon,
  // switch: LoopIcon,
  // dashboard: Dashboard,
  // settingsApplications: SettingsApplicationsIcon,
  // recordVoiceOver: RecordVoiceOverIcon,
  // phone: PhoneIcon,
  // mail: EmailIcon,
  // whatsapp: WhatsAppIcon,
  // location: LocationOnIcon,
  // addComment: AddCommentIcon,
  // order: ReceiptLongIcon,
  // change: ChangeCircleIcon,
  // google: GoogleIcon
  rowLeft: GoChevronLeft,
  rowRight: GoChevronRight,
  rowDown: GoChevronDown,
  rowUp: GoChevronUp,
  settings: MdSettings,
  download: MdDownload,
  upload: MdUpload,
  camera: MdOutlinePhotoCamera,
  addImage: RiImageAddLine,
  info: MdInfoOutline,
  warning: MdWarningAmber,
  undo: MdOutlineUndo,
  cancel: FcCancel,

  refresh: MdOutlineRefresh,
  copy: MdCopyAll,
  arrowForward: MdOutlineArrowForward,
  openEye: MdOutlineRemoveRedEye,
  pin: RiPushpinLine,
  unPin: RiUnpinLine,
  //rent: IoKeyOutline,
  repair: IoHammerOutline,
  sale: IoPricetagsOutline,
  wrench: FaWrench,
  truck: FaTruckPickup,
  home: GoHomeFill,
  calendarTime: LuCalendarClock,
  siren: PiSiren,
  report: PiSiren,
  payment: MdOutlinePaid,
  starFilled: MdOutlineStar,
  starHalf: MdStarHalf,
  starEmpty: MdOutlineStarBorder,
  target: MdMyLocation,
  tools: LiaToolsSolid,
  comment: BiCommentDots,
  none: null
} as const

export type IconName = keyof typeof icons
const Icon = ({
  icon,
  size = 30,
  ...props
}: {
  icon: IconName | 'none'
  color?: string
  size?: number
}) => {
  if (icon === 'none') return null
  const Component = icons[icon]
  if (!Component) return <>Icon</>
  return <Component size={size} {...props} />
}
export default Icon
