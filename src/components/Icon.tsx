import { IoMdSwap, IoMdAdd } from 'react-icons/io'

import React from 'react'
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
  MdChevronLeft,
  MdChevronRight,
  MdSettings,
  MdDownload,
  MdOutlinePhotoCamera,
  MdInfoOutline,
  MdWarningAmber,
  MdOutlineUndo,
  MdCancel,
  MdOutlineRefresh,
  MdCopyAll,
  MdUpload,
  MdOutlineArrowForward,
  MdOutlineRemoveRedEye,
  MdOutlineAlarm,
  MdOutlineTimerOff
} from 'react-icons/md'
import { RiUnpinLine, RiPushpinLine } from 'react-icons/ri'
import { IoKeyOutline } from 'react-icons/io5'
import { IoPricetagsOutline } from 'react-icons/io5'
import { FaTruckPickup } from 'react-icons/fa6'
import { LuCalendarClock } from 'react-icons/lu'
import { LuCalendar } from 'react-icons/lu'
import { MdOutlinePaid } from 'react-icons/md'

import {
  IoPersonOutline,
  IoPersonSharp,
  IoPersonAddOutline
} from 'react-icons/io5'
import { LuComponent } from 'react-icons/lu'
import { PiUserList } from 'react-icons/pi'
import { FaRegWindowRestore } from 'react-icons/fa6'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
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

// https://react-icons.github.io/react-icons/
const icons = {
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
  rowLeft: MdChevronLeft,
  rowRight: MdChevronRight,
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
  home: MdHome,
  calendarTime: LuCalendarClock,
  siren: PiSiren,
  report: PiSiren,
  payment: MdOutlinePaid
} as const

export type IconName = keyof typeof icons
const Icon = ({
  icon,
  size = 30,
  ...props
}: {
  icon: IconName
  color?: string
  size?: number
}) => {
  const Component = icons[icon]
  if (!Component) return <>Icon</>
  return <Component size={size} {...props} />
}
export default Icon
