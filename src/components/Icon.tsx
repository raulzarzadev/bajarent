import { IoMdCalendar, IoMdSwap, IoMdAdd } from 'react-icons/io'

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
  MdChevronRight
} from 'react-icons/md'

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

// https://react-icons.github.io/react-icons/
const icons = {
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
  calendar: IoMdCalendar,
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
  rowRight: MdChevronRight
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
