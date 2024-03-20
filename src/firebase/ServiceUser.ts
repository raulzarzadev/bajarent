import { where } from 'firebase/firestore'
import StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'

// ? FIXME: StoreType?? this should be UserType
class ServiceUsersClass extends FirebaseGenericService<StoreType> {
  constructor() {
    super('users')
  }

  async searchUser(text) {
    if (!text) return null
    const byEmail = await super.findOne([where('email', '==', text)])
    const byName = await super.findOne([where('name', '==', text)])
    const byPhone = await super.findOne([where('phone', '==', text)])
    return [byEmail, byName, byPhone].filter((item) => item)
  }

  async findByEmail(email: string) {
    return await super.findOne([where('email', '==', email)])
  }
  // Agrega tus métodos aquí
}

export const ServiceUsers = new ServiceUsersClass()
