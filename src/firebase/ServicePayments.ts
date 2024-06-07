import { where, documentId, limit, orderBy } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import PaymentType from '../types/PaymentType'
class ServicePaymentsClass extends FirebaseGenericService<PaymentType> {
  constructor() {
    super('payments')
  }

  async getByStore(storeId: string) {
    return this.getItems([where('storeId', '==', storeId)])
  }

  async getByOrder(orderId: string) {
    return this.getItems([where('orderId', '==', orderId)])
  }

  listenByOrder(orderId: string, callback: (items: PaymentType[]) => void) {
    return this.listenMany([where('orderId', '==', orderId)], callback)
  }
  list = async (list: string[] = []) => {
    if (!list.length) return []
    return this.getItems([where(documentId(), 'in', list)])
  }
  async getToday(storeId: string) {
    return this.getItems([
      where('storeId', '==', storeId),
      where('createdAt', '>=', new Date().setHours(0, 0, 0, 0)),
      where('createdAt', '<=', new Date().setHours(23, 59, 59, 999))
    ])
  }

  async getLast(storeId: string, { count = 10 }) {
    return this.getItems([
      where('storeId', '==', storeId),
      limit(count),
      orderBy('createdAt', 'desc')
    ])
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServicePayments = new ServicePaymentsClass()
