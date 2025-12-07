import type { ContactType } from '../../types/OrderType'

const chooseOrderPhone = order => {
	const orderContacts = order?.contacts as ContactType[]
	const phone = orderContacts?.find(c => c?.isFavorite)?.phone || order?.phone
	return phone
}

export default chooseOrderPhone
