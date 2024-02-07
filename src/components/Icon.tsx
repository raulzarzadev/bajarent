import { StyleSheet } from 'react-native'
import React from 'react'
import {
  MdAssignmentInd,
  MdEdit,
  MdClose,
  MdAttachMoney,
  MdSave,
  MdLocationPin,
  MdOutlineStorefront,
  MdListAlt
} from 'react-icons/md'
import { IoPersonOutline } from 'react-icons/io5'
import { LuComponent } from 'react-icons/lu'
import { PiUserList } from 'react-icons/pi'

import { IoMdAdd } from 'react-icons/io'

const icons = {
  close: MdClose,
  store: MdOutlineStorefront,
  orders: MdListAlt,
  profile: IoPersonOutline,
  components: LuComponent,
  myOrders: PiUserList,
  add: IoMdAdd,
  edit: MdEdit,
  money: MdAttachMoney,
  save: MdSave,
  location: MdLocationPin
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
} as const

export type IconName = keyof typeof icons
const Icon = ({ icon, ...props }: { icon: IconName; color: string }) => {
  const Component = icons[icon]
  if (!Component) return <>Icon</>
  return <Component size={30} {...props} />
}
export default Icon
