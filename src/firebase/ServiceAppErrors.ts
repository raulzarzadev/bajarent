import BaseType from '../types/BaseType'
import { FirebaseGenericService } from './genericService'
export type AppErrorType = {
  code: string
  message: string
  componentName: string
} & BaseType
class ServiceStoresClass extends FirebaseGenericService<AppErrorType> {
  constructor() {
    super('errors')
  }
}

export const ServiceAppErrors = new ServiceStoresClass()
