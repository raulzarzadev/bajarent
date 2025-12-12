import { ServiceCategories } from '../../firebase/ServiceCategories'
import { ServicePrices } from '../../firebase/ServicePrices'
import { ServiceSections } from '../../firebase/ServiceSections'
import { ServiceStores } from '../../firebase/ServiceStore'

export const getFullStoreData = async storeId => {
	const store = await getStore(storeId)
	const sections = await getSections(storeId)
	const categories = await getCategories(storeId)
	const prices = await getPrices(storeId)
	const staff = store?.staff || []
	const data = {
		...store,
		sections,
		staff,
		categories: categories.map(c => ({
			...c,
			prices: prices.filter(p => p.categoryId === c.id)
		}))
	}
	return data
}

const getStore = async storeId => {
	return await ServiceStores.get(storeId)
}
const getSections = async storeId => {
	return await ServiceSections.getByStore(storeId)
}

const getCategories = async storeId => {
	return await ServiceCategories.getByStore(storeId)
}

const getPrices = async storeId => {
	return await ServicePrices.getByStore(storeId)
}
