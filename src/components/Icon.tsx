import { BiCommentDots } from 'react-icons/bi'
import { BsClipboardCheck, BsClipboardPlus, BsWhatsapp } from 'react-icons/bs'
import { CgSmartHomeWashMachine } from 'react-icons/cg'
import {
	FaBalanceScale,
	FaCashRegister,
	FaChevronDown,
	FaChevronUp,
	FaCloudDownloadAlt
} from 'react-icons/fa'
import {
	FaAddressCard,
	FaFileContract,
	FaRegFilePdf,
	FaRegWindowRestore,
	FaTruckPickup,
	FaWrench
} from 'react-icons/fa6'
import { FcCancel } from 'react-icons/fc'
import { GiReceiveMoney } from 'react-icons/gi'
import {
	GoChevronDown,
	GoChevronLeft,
	GoChevronRight,
	GoChevronUp,
	GoHomeFill
} from 'react-icons/go'
import { GrFormSubtract } from 'react-icons/gr'
import { HiDotsVertical } from 'react-icons/hi'
import { IoIosGitMerge, IoMdAdd, IoMdSwap } from 'react-icons/io'
import {
	IoHammerOutline,
	IoPersonAddOutline,
	IoPersonOutline,
	IoPersonSharp,
	IoPricetagsOutline
} from 'react-icons/io5'
import { LiaBroomSolid, LiaToolsSolid } from 'react-icons/lia'
import {
	LuBot,
	LuCalendar,
	LuCalendarClock,
	LuClipboard,
	LuClipboardList,
	LuClipboardMinus,
	LuClipboardPaste,
	LuClipboardPenLine,
	LuComponent,
	LuFolderCheck,
	LuWarehouse
} from 'react-icons/lu'
import {
	MdAttachMoney,
	MdClose,
	MdCopyAll,
	MdDeleteOutline,
	MdDownload,
	MdEdit,
	MdFilterList,
	MdInfoOutline,
	MdListAlt,
	MdLocationOff,
	MdLocationPin,
	MdMoneyOff,
	MdMyLocation,
	MdOutlineAlarm,
	MdOutlineArrowForward,
	MdOutlineDone,
	MdOutlineHistory,
	MdOutlineInventory,
	MdOutlineMailOutline,
	MdOutlinePaid,
	MdOutlinePhotoCamera,
	MdOutlineRefresh,
	MdOutlineRemoveRedEye,
	MdOutlineSearch,
	MdOutlineStar,
	MdOutlineStarBorder,
	MdOutlineStorefront,
	MdOutlineTimerOff,
	MdOutlineUndo,
	MdPendingActions,
	MdSave,
	MdSettings,
	MdStarHalf,
	MdUpload,
	MdWarningAmber
} from 'react-icons/md'
import { PiArrowFatLinesUpFill, PiSignatureDuotone, PiSiren, PiUserList } from 'react-icons/pi'
import { RiImageAddLine, RiPushpinLine, RiUnpinLine } from 'react-icons/ri'
import { RxLapTimer } from 'react-icons/rx'
import { TbClipboardSearch, TbMapSearch, TbMapShare } from 'react-icons/tb'
import { TfiWorld } from 'react-icons/tfi'
import { TiPhone } from 'react-icons/ti'

// https://react-icons.github.io/react-icons/
const icons = {
	filePDF: FaRegFilePdf,
	navigate: TbMapShare,
	folderCheck: LuFolderCheck,
	merge: IoIosGitMerge,
	orderAdd: BsClipboardPlus,
	orderDone: BsClipboardCheck,
	orderSearch: TbClipboardSearch,
	orderEdit: LuClipboardPenLine,
	orderGo: LuClipboardPaste,
	orderList: LuClipboardList,
	order: LuClipboard,
	orderRemove: LuClipboardMinus,
	contract: FaFileContract,
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
	warehouse: LuWarehouse,
	none: null,
	chatbot: LuBot
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
