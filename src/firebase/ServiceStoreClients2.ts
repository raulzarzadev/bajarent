import { where } from 'firebase/firestore'
import type { ClientType } from '../types/ClientType'
import { ServiceStores } from './ServiceStore'

const SUB_COLLECTION = 'clients'
export class ServiceStoreClientsClass {
	async add({ storeId, client }) {
		return ServiceStores.createInSubCollection({
			parentId: storeId,
			newItem: client,
			subCollectionName: SUB_COLLECTION
		})
	}

	async getAll(storeId: string) {
		return ServiceStores.getItemsInCollection({
			parentId: storeId,
			subCollection: SUB_COLLECTION
		})
	}
	async getActive(storeId: string) {
		return ServiceStores.getItemsInCollection({
			parentId: storeId,
			subCollection: SUB_COLLECTION,
			filters: [where('isActive', '==', true)]
		})
	}

	async getSimilar(storeId: string, client: Partial<ClientType>) {
		const similarName = ServiceStores.getItemsInCollection({
			parentId: storeId,
			subCollection: SUB_COLLECTION,
			filters: [where('name', '==', client.name)]
		})
		const similarPhone = ServiceStores.getItemsInCollection({
			parentId: storeId,
			subCollection: SUB_COLLECTION,
			filters: [where('phone', '==', client.phone)]
		})

		return Promise.all([similarName, similarPhone]).then(res => {
			const batch = res.flat()
			// remove duplicates
			const unique = batch.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
			return unique
		})
	}

	async get({ storeId, itemId }: { storeId: string; itemId: string }) {
		return ServiceStores.getItemInCollection({
			itemId,
			parentId: storeId,
			subCollection: SUB_COLLECTION
		})
	}

	async update({
		storeId,
		itemId,
		itemData
	}: {
		storeId: string
		itemId: string
		itemData: Partial<ClientType>
	}) {
		return ServiceStores.updateInSubCollection({
			parentId: storeId,
			subCollection: SUB_COLLECTION,
			itemId,
			itemData
		})
	}

	async delete({ storeId, itemId }: { storeId: string; itemId: string }) {
		return ServiceStores.deleteInSubCollection({
			parentId: storeId,
			subCollection: SUB_COLLECTION,
			itemId
		})
	}

	// Agrega tus métodos aquí
	async customMethod() {
		// Implementa tu método personalizado
	}
}

export const ServiceStoreClients = new ServiceStoreClientsClass()
