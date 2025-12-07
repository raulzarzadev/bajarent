/**
 *
 * @param phone if number starts with 52 o +52 remove it, then add 521
 * @returns formatted phone number
 */
const formatMxWhatsappPhone = (phone: string) => {
	let cleanedPhone = phone.replace(/[^0-9]/g, '')

	if (cleanedPhone.startsWith('52')) {
		cleanedPhone = cleanedPhone.slice(-10)
		return `521${cleanedPhone}`
	} else {
		return cleanedPhone
	}
}

export default formatMxWhatsappPhone
