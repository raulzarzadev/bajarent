import { Platform } from 'react-native'

export const getOperatingSystem = () => {
	if (Platform.OS === 'web') {
		const userAgent = navigator.userAgent.toLowerCase()
		if (userAgent.includes('win')) {
			return 'win'
		} else if (userAgent.includes('mac')) {
			return 'mac'
		} else {
			return 'Other'
		}
	} else {
		return Platform.OS
	}
}
