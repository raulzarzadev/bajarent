import { where } from 'firebase/firestore'
import StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'

// ? FIXME: StoreType?? this should be UserType
class ServiceUsersClass extends FirebaseGenericService<StoreType> {
  constructor() {
    super('users')
  }

  async searchUser(text) {
    const textWithoutSpaces = text.replace(/ /g, '')
    if (!text) return null
    const byEmail = await super.findOne([
      where('email', '==', textWithoutSpaces)
    ])
    const byName = await super.findOne([where('name', '==', text)])
    /* ******************************************** 
      Should we search by phone number from other countries                
     *******************************************rz */
    const phone = textWithoutSpaces.replace('+52', '')
    const byPhone = await super.findOne([where('phone', '==', `+52${phone}`)])

    return [byEmail, byName, byPhone].filter((item) => item)
  }

  async findByEmail(email: string) {
    return await super.findOne([where('email', '==', email)])
  }
  // Agrega tus métodos aquí
}

export const ServiceUsers = new ServiceUsersClass()
