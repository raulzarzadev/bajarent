import { useState } from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { ServiceStores } from '../firebase/ServiceStore'
import { useShop } from '../hooks/useShop'
import catchError from '../libs/catchError'
import InputSwitch from './InputSwitch'

const InputDisabledStaff = ({ staffId }) => {
	const { shop } = useShop()
	const shopStaff = shop?.staff || []
	const { permissions } = useEmployee()
	const canDisabledStaff =
		permissions.isAdmin || permissions.isOwner || permissions?.store?.disabledStaff

	const staff = shopStaff.find(staff => staff.id === staffId)
	const [staffDisabled, setStaffDisabled] = useState(staff?.disabled)
	const [inputDisabled, setInputDisabled] = useState(false)
	const toggleDisabled = async value => {
		setInputDisabled(true)
		setStaffDisabled(value)
		const [err, res] = await catchError(
			ServiceStores.updateStaff({
				storeId: shop.id,
				staffId: staff.id,
				staff: {
					disabled: value
				}
			})
		)
		if (err) {
			return console.error(err)
		}
		setInputDisabled(false)
	}

	return (
		<InputSwitch
			disabled={inputDisabled || !canDisabledStaff}
			value={!staffDisabled}
			setValue={value => {
				toggleDisabled(!value)
			}}
		/>
	)
}

export default InputDisabledStaff
