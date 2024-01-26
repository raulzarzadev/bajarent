import { where } from 'firebase/firestore'
import StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'
class ServiceUsersClass extends FirebaseGenericService<StoreType> {
  constructor() {
    super('users')
  }

  async searchUser(text) {
    if (!text) return null
    const byEmail = await super.findOne([where('email', '==', text)])
    const byName = await super.findOne([where('name', '==', text)])
    const byPhone = await super.findOne([where('phone', '==', text)])
    console.log({ byEmail, byName, byPhone })
    return [byEmail, byName, byPhone].filter((item) => item)
  }
  // Agrega tus métodos aquí
}

export const ServiceUsers = new ServiceUsersClass()
