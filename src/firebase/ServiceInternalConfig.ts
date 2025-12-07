import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'

export type InternalConfigurationType = {
	version?: string | null | undefined
	id: string
}

const CONFIG_ID = 'remote-version'

class ServiceInternalConfiguration extends FirebaseGenericService<InternalConfigurationType> {
	constructor() {
		super('InternalConfiguration')
	}
	getVersion() {
		return this.findOne([where('id', '==', CONFIG_ID)])
			.then(doc => {
				return doc?.version
			})
			.catch(error => {
				console.error('ServiceInternalConfiguration', error)
			})
	}
	listenVersion = cb => {
		this.listen(CONFIG_ID, res => cb(res?.version))
	}
}

export const ServiceInternalConfig = new ServiceInternalConfiguration()
