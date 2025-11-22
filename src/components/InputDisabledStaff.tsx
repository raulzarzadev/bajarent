import React, { useState } from 'react'
import InputSwitch from './InputSwitch'
import { useStore } from '../contexts/storeContext'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { useEmployee } from '../contexts/employeeContext'
import { useShop } from '../hooks/useShop'
import { ServiceStores } from '../firebase/ServiceStore'
import catchError from '../libs/catchError'

const InputDisabledStaff = ({ staffId }) => {
  const { shop } = useShop()
  const shopStaff = shop?.staff || []
  const { staff: staffs, handleUpdateStore } = useStore()
  const { permissions } = useEmployee()
  const canDisabledStaff =
    permissions.isAdmin ||
    permissions.isOwner ||
    permissions?.store?.disabledStaff

  const staff = shopStaff.find((staff) => staff.id === staffId)
  const [staffDisabled, setStaffDisabled] = useState(staff?.disabled)
  const [inputDisabled, setInputDisabled] = useState(false)
  const toggleDisabled = async (value) => {
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
      console.error(err)
    }

    try {
      // update staff in each shop serviceStaff will be deprecated later
      //const res = await ServiceStaff.update(staff.id, { disabled: value })
      // console.log(res)
      // handleUpdateStore()
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
