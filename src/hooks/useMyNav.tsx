import {
	type NavigationProp,
	type NavigatorScreenParams,
	useNavigation
} from '@react-navigation/native'
import type { RootTabParamList, WorkshopStackParamList } from '../navigation/types'

const useMyNav = () => {
	// combine because this hook navigates across stacks; fallback Record keeps other stacks permissive
	const { navigate } = useNavigation<NavigationProp<RootTabParamList & Record<string, any>>>()
	const toItems = ({
		id,
		screenNew,
		screenEdit,
		ids,
		to
	}: {
		to?: 'new' | 'edit' | 'details' | 'newOrder' | 'customerOrder'
		id?: string
		/**
		 * @deprecated use to='new' instead
		 */
		screenNew?: boolean
		/**
		 * @deprecated use to='new' instead
		 */
		screenEdit?: boolean
		ids?: string[]
	}) => {
		if (to === 'new' || screenNew) {
			return navigate('StackItems', {
				screen: 'ScreenItemNew'
			})
		}
		if (to === 'details' && id) {
			navigate('StackItems', {
				screen: 'ScreenItemsDetails',
				params: {
					id
				}
			})
			return
		}
		if (to === 'edit' && id) {
			navigate('StackItems', {
				screen: 'ScreenItemEdit',
				params: {
					id
				}
			})
			return
		}
		if (Array.isArray(ids) && ids.length > 0) {
			navigate('StackItems', {
				screen: 'ScreenItems',
				params: {
					ids
				}
			})
		}
		if (screenEdit && id) {
			navigate('StackMyItems', {
				screen: 'StackItems',
				params: {
					screen: 'ScreenItemEdit',
					params: { id }
				}
			})
			return
		}

		if (screenNew) {
			navigate('StackMyItems', {
				screen: 'StackItems',
				params: {
					screen: 'ScreenItemNew'
				}
			})
			return
		} else if (id) {
			navigate('StackMyItems', {
				screen: 'StackItems',
				params: {
					screen: 'ScreenItemsDetails',
					params: { id }
				}
			})
			return
		}
	}
	const toPayments = ({
		id,
		ids,
		idsTitle
	}: {
		id?: string
		ids?: string[]
		idsTitle?: string
	}) => {
		if (Array.isArray(ids) && ids.length > 0) {
			navigate('StackOrders', {
				screen: 'StackPayments',
				params: {
					screen: 'ScreenPayments',
					params: {
						title: idsTitle || 'Pagos',
						payments: ids
					}
				}
			})
		}

		if (id) {
			navigate('StackOrders', {
				screen: 'StackPayments',
				params: {
					screen: 'ScreenPaymentsDetails',
					params: {
						id
					}
				}
			})
			return
		}
	}
	const toWorkshop = () => {
		navigate('Workshop', {
			screen: 'WorkshopHistory'
		} as NavigatorScreenParams<WorkshopStackParamList>)
	}

	const toCustomers = (props: ToCustomersType) => {
		if (props.to === 'customerOrder' && props.orderId) {
			navigate('StackOrders', {
				screen: 'OrderDetails',
				params: {
					orderId: props.orderId
				}
			})
		}
		if (props?.to === 'newOrder' && props?.customerId) {
			navigate('StackOrders', {
				screen: 'ScreenNewOrder',
				params: {
					customerId: props?.customerId
				}
			})
		}
		if (props.to === 'new') {
			navigate('StackCustomers', {
				screen: 'ScreenCustomerNew'
			})
		}

		if (props.to === 'details' && props.id) {
			navigate('StackCustomers', {
				screen: 'ScreenCustomer',
				params: {
					id: props.id
				}
			})
		}
		if (props.to === 'edit' && props.id) {
			navigate('StackCustomers', {
				screen: 'ScreenCustomerEdit',
				params: {
					id: props.id
				}
			})
		}
	}

	type ToOrdersType = {
		id?: string
		ids?: string[]
		screenNew?: boolean
		idsTitle?: string
		screen?: 'renew'
		customerId?: string
		to?: 'new' | 'details' | 'edit'
	}
	const toOrders = ({
		id,
		ids,
		screenNew,
		idsTitle,
		screen,
		customerId,
		to
	}: ToOrdersType = {}) => {
		if (to === 'new') {
			navigate('StackOrders', {
				screen: 'ScreenNewOrder',
				params: {
					customerId
				}
			})
			return
		}
		if (screen === 'renew') {
			navigate('StackOrders', {
				screen: 'RenewOrder',
				params: {
					orderId: id
				}
			})
			return
		}
		if (Array.isArray(ids) && ids.length > 0) {
			navigate('StackOrders', {
				screen: 'ScreenSelectedOrders',
				params: {
					title: idsTitle || 'Ordenes seleccionadas',
					orders: ids
				}
			})
		}

		if (screenNew) {
			navigate('StackOrders', {
				screen: 'ScreenNewOrder',
				params: { customerId }
			})
			return
		}
		if (id) {
			navigate('StackOrders', {
				screen: 'OrderDetails',
				params: {
					orderId: id
				}
			})
			return
		}
	}
	const toProfile = () => {
		navigate('Profile')
	}

	const toSections = ({
		id,
		screenNew,
		screenEdit
	}: {
		id?: string
		screenNew?: boolean
		screenEdit?: boolean
	}) => {
		if (screenEdit && id) {
			navigate('Store', {
				screen: 'StackSections',
				params: {
					screen: 'ScreenSectionsEdit',
					params: { id }
				}
			})
			return
		}

		if (screenNew) {
			navigate('Store', {
				screen: 'StackSections',
				params: {
					screen: 'ScreenSectionsNew'
				}
			})
			return
		} else if (id) {
			navigate('Store', {
				screen: 'StackSections',
				params: {
					screen: 'ScreenSectionSDetails',
					params: { id }
				}
			})
			return
		}
	}
	const toMessages = () => {
		navigate('StackOrders', {
			screen: 'ScreenMessages'
		})
	}

	const toBalance = ({ to, id }: { to: 'details'; id: string }) => {
		if (to === 'details' && id) {
			navigate('Store', {
				screen: 'StackBalances',
				params: {
					screen: 'ScreenBalance_v3',
					params: {
						balanceId: id
					}
				}
			})
		}
	}

	return {
		toBalance,
		toItems,
		toOrders,
		toPayments,
		toProfile,
		toSections,
		toWorkshop,
		toMessages,
		toCustomers
	}
}

export type ToCustomersType =
	| {
			to: 'new'
			customerId?: string
	  }
	| {
			to: 'details'
			id: string
	  }
	| {
			to: 'edit'
			id: string
	  }
	| {
			to: 'newOrder'
			customerId: string
	  }
	| {
			to: 'customerOrder'
			orderId: string
	  }

export default useMyNav
