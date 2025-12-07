import { StaffPermissions, StaffPermissionsKeys } from '../../types/StaffType'

export const hasPermissions = (
	action: StaffPermissionsKeys,
	staffPermissions: StaffPermissions
) => {
	const permissions = staffPermissions || {}

	// Handle nested properties like "items.canAssign"
	if (action.includes('.')) {
		const keys = action.split('.')
		let current: any = permissions

		for (const key of keys) {
			current = current?.[key]
			if (current === undefined) return false
		}

		return Boolean(current)
	}

	return permissions[action] || false
}
