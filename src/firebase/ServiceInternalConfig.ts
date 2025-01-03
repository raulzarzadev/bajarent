import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'

export type InternalConfigurationType = {
  version?: string | null | undefined
  id: string
}

const CONFIG_ID = 'w0mdPzGdk8nQ2tY1oiqT'

class ServiceInternalConfiguration extends FirebaseGenericService<InternalConfigurationType> {
  constructor() {
    super('InternalConfiguration')
  }
  getVersion() {
    return this.findOne([where('id', '==', CONFIG_ID)])
      .then((doc) => {
        return doc?.version
      })
      .catch((error) => {
        console.error('ServiceInternalConfiguration', error)
      })
  }
  listenVersion = (cb) => {
    this.listen(CONFIG_ID, (res) => cb(res?.version))
  }
}

export const ServiceInternalConfig = new ServiceInternalConfiguration()
