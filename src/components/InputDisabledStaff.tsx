import React, { useState } from 'react'
import InputSwitch from './InputSwitch'
import { useStore } from '../contexts/storeContext'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { useEmployee } from '../contexts/employeeContext'

const InputDisabledStaff = ({ staffId }) => {
  const { staff: staffs } = useStore()
  const { permissions } = useEmployee()
  const canDisabledStaff =
    permissions.isAdmin ||
    permissions.isOwner ||
    permissions?.store?.disabledStaff

  const staff = staffs.find((staff) => staff.id === staffId)
  const [staffDisabled, setStaffDisabled] = useState(staff?.disabled)
  const [inputDisabled, setInputDisabled] = useState(false)
  const toggleDisabled = async (value) => {
    setInputDisabled(true)
    setStaffDisabled(value)
    try {
      const res = await ServiceStaff.update(staff.id, { disabled: value })
      console.log(res)
    } catch (e) {
      console.error(e)
    } finally {
      setInputDisabled(false)
    }
  }

  return (
    <InputSwitch
      disabled={inputDisabled || !canDisabledStaff}
      value={!staffDisabled}
      setValue={(value) => {
        toggleDisabled(!value)
      }}
    />
  )
}

export default InputDisabledStaff
