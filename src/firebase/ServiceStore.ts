import { where } from 'firebase/firestore'
import { createUUID } from '../libs/createId'
import type StaffType from '../types/StaffType'
import type StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'
import { ServiceStaff } from './ServiceStaff'
export class ServiceStoresClass extends FirebaseGenericService<StoreType> {
	constructor() {
		super('stores')
	}

	async getStoresByUserId(userId: string) {
		return this.getItems([where('createdBy', '==', userId)])
	}

	async getWhereUserIsStaff(userId: string) {
		const staffWithStore = await ServiceStaff.getItems([where('userId', '==', userId)])
		const storesIds = staffWithStore.map(({ storeId }) => storeId)
		const staffStores = await Promise.all(storesIds.map(id => this.get(id)))
		const removeInvalid = staffStores.filter(store => !!store)
		return removeInvalid
	}

	async userStores(userId: string) {
		const asStaff = await this.getWhereUserIsStaff(userId)
		const asOwner = await this.getStoresByUserId(userId)
		const uniqueStores = new Set([...asStaff.map(({ id }) => id), ...asOwner.map(({ id }) => id)])
		return Array.from(uniqueStores).map(id =>
			[...asStaff, ...asOwner].find(store => store.id === id)
		)
	}

	async updateStaff({
		storeId,
		staffId,
		staff
	}: {
		storeId: string
		staffId: string
		staff: Partial<StaffType>
	}) {
		const store = await this.get(storeId)
		if (!store) throw new Error('Store not found')
		const currentStaff = store.staff || []
		const employee = currentStaff.find(s => s.id === staffId)
		if (!employee) throw new Error('Staff member not found in store')
		const updatedStaff = currentStaff.map(s => (s.id === staffId ? { ...s, ...staff } : s))

		return this.update(storeId, { staff: updatedStaff })
	}

	async removeStaff({ storeId, staffId }: { storeId: string; staffId: string }) {
		const store = await this.get(storeId)
		if (!store) throw new Error('Store not found')
		const currentStaff = store.staff || []
		const updatedStaff = currentStaff.filter(s => s.id !== staffId)
		return this.update(storeId, { staff: updatedStaff })
	}

	async addStaff({ storeId, staff }: { storeId: string; staff: Partial<StaffType> }) {
		const store = await this.get(storeId)
		if (!store) throw new Error('Store not found')

		const currentStaff = store.staff || []
		staff.id = createUUID()
		const updatedStaff = [...currentStaff, staff as StaffType]
		return this.update(storeId, { staff: updatedStaff })
	}

	/**
	 * Add or remove staff to section, by updating each staff members assignedSections
	 * Put this section in each assignedSection staff
	 * @param param0 storeId, sectionId staffIds[]
	 * @returns Promise<void>
	 */
	async setStaffToSection({
		storeId,
		sectionId,
		staffIds
	}: {
		storeId: string
		sectionId: string
		staffIds: string[]
	}) {
		const shop = await this.get(storeId)
		if (!shop) throw new Error('Store not found')
		const shopStaff = shop.staff || []

		const staffUpdated = shopStaff.map(s => {
			if (staffIds.includes(s.id)) {
				return {
					...s,
					sectionsAssigned: s.sectionsAssigned
						? Array.from(new Set([...s.sectionsAssigned, sectionId]))
						: [sectionId]
				}
			} else {
				return {
					...s,
					sectionsAssigned: s.sectionsAssigned
						? s.sectionsAssigned.filter(secId => secId !== sectionId)
						: []
				}
			}
		})
		return this.update(storeId, { staff: staffUpdated })
	}

	async addStaffToSection({
		storeId,
		sectionId,
		staffIds
	}: {
		storeId: string
		sectionId: string
		staffIds: string[]
	}) {
		const store = await this.get(storeId)
		if (!store) throw new Error('Store not found')

		const currentStaff = store.staff || []
		const updatedStaff = currentStaff.map(s => {
			if (staffIds.includes(s.id)) {
				const sectionsAssigned = s.sectionsAssigned || []
				if (!sectionsAssigned.includes(sectionId)) {
					return {
						...s,
						sectionsAssigned: [...sectionsAssigned, sectionId]
					}
				}
			}
			return s
		})
		return this.update(storeId, { staff: updatedStaff })
	}

	// Agrega tus métodos aquí
	async customMethod() {
		// Implementa tu método personalizado
	}
}

export const nextItemNumber = ({ currentNumber = '0000' }: { currentNumber: string }) => {
	const newValue = parseInt(currentNumber) + 1
	return newValue.toString().padStart(5, '0')
}

export const ServiceStores = new ServiceStoresClass()
