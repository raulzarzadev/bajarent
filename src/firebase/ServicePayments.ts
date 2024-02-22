import { where } from 'firebase/firestore'
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

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServicePayments = new ServicePaymentsClass()
