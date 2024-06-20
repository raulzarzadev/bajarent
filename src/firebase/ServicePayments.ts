import { where, documentId, limit, orderBy } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import PaymentType from '../types/PaymentType'
import { addDays, subDays } from 'date-fns'
class ServicePaymentsClass extends FirebaseGenericService<PaymentType> {
  constructor() {
    super('payments')
  }

  async orderPayment(payment: PaymentType) {
    return this.create({
      ...payment,
      orderId: payment.orderId,
      storeId: payment.storeId,
      method: payment.method,
      reference: payment.reference,
      amount: parseFloat(`${payment.amount || 0}`)
    })
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
    const MAX_BATCH_SIZE = 30 // Ajustar según las limitaciones de la base de datos/API
    const batches = []
    for (let i = 0; i < list.length; i += MAX_BATCH_SIZE) {
      batches.push(list.slice(i, i + MAX_BATCH_SIZE))
    }
    const results = []
    for (const batch of batches) {
      const batchResults = await this.getItems([
        where(documentId(), 'in', batch)
      ])
      results.push(...batchResults)
    }
    return results
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

  async getLast(storeId: string, { count = 10, days = 0 }) {
    if (days) {
      return this.getItems([
        where('storeId', '==', storeId),
        where(
          'createdAt',
          '>=',
          new Date(subDays(new Date(), days).setHours(0, 0, 0, 0))
        ),

        orderBy('createdAt', 'desc')
      ])
    }
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
