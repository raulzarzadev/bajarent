import { arrayRemove, arrayUnion, where } from 'firebase/firestore'
import type { SectionType } from '../types/SectionType'
import { FirebaseGenericService } from './genericService'

class ServiceSectionsClass extends FirebaseGenericService<SectionType> {
	constructor() {
		super('sections')
	}

	async getByStore(storeId: string) {
		return this.getItems([where('storeId', '==', storeId)])
	}

	async addStaff(sectionId: string, staffId: string) {
		// @ts-expect-error
		return this.update(sectionId, { staff: arrayUnion(staffId) })
	}

	async removeStaff(sectionId: string, staffId: string) {
		// @ts-expect-error
		return this.update(sectionId, { staff: arrayRemove(staffId) })
	}
}

export const ServiceSections = new ServiceSectionsClass()
