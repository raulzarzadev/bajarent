import StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'
class ServiceUsersClass extends FirebaseGenericService<StoreType> {
  constructor() {
    super('users')
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceUsers = new ServiceUsersClass()
