import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const os = Platform.OS
const webStorage = window.localStorage
const appStorage = AsyncStorage

export const getItem = async (key: string) => {
	if (key) {
		return os === 'web' ? webStorage.getItem(key) : await appStorage.getItem(key)
	}

	return null
}

export const setItem = async (key: string, payload: string) => {
	if (key && typeof payload === 'string') {
		return os === 'web' ? webStorage.setItem(key, payload) : await appStorage.setItem(key, payload)
	}

	return null
}

export const removeItem = async (key: string) => {
	if (key) {
		return os === 'web' ? webStorage.removeItem(key) : await appStorage.removeItem(key)
	}

	return null
}
