import AsyncStorage from '@react-native-async-storage/async-storage'

export const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'
const PERSISTENCE_REVISION = '2025-11-24'

export async function loadNavigationState() {
	try {
		const [stateString, revision] = await Promise.all([
			AsyncStorage.getItem(PERSISTENCE_KEY),
			AsyncStorage.getItem(`${PERSISTENCE_KEY}_REVISION`)
		])

		if (!stateString) return undefined
		if (revision !== PERSISTENCE_REVISION) {
			await clearNavigationState()
			return undefined
		}

		return JSON.parse(stateString)
	} catch (error) {
		console.warn('Error restoring navigation state:', error)
		return undefined
	}
}

export async function persistNavigationState(state) {
	try {
		await Promise.all([
			AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)),
			AsyncStorage.setItem(`${PERSISTENCE_KEY}_REVISION`, PERSISTENCE_REVISION)
		])
	} catch (error) {
		console.warn('Error persisting navigation state:', error)
	}
}

export async function clearNavigationState() {
	await Promise.all([
		AsyncStorage.removeItem(PERSISTENCE_KEY),
		AsyncStorage.removeItem(`${PERSISTENCE_KEY}_REVISION`)
	])
}
