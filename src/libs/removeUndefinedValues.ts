//@ts-nocheck
export const replaceUndefinedWithNull = <T extends Record<string, any>>(obj: T): T => {
	if (obj === undefined) return null as T
	if (obj === null) return null as T
	if (typeof obj !== 'object') return obj

	if (Array.isArray(obj)) {
		return obj.map(item => replaceUndefinedWithNull(item)) as T
	}

	return Object.keys(obj).reduce((acc, key) => {
		acc[key] = replaceUndefinedWithNull(obj[key])
		return acc
	}, {} as T)
}
