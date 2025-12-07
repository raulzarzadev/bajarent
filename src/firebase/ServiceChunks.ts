import { ConsolidatedStoreOrdersType } from './ServiceConsolidatedOrders'
import { FirebaseGenericService } from './genericService'

type Type = {
	id: string
	storeId: string
	orders: ConsolidatedStoreOrdersType['orders']
}

class ChunksClass extends FirebaseGenericService<Type> {
	constructor() {
		super('chunks')
	}

	// Agrega tus métodos aquí
	async customMethod() {
		// Implementa tu método personalizado
	}
}

export const ServiceChunks = new ChunksClass()
