import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import InputSwitch from './InputSwitch'
import { useStore } from '../contexts/storeContext'
import { ServiceStaff } from '../firebase/ServiceStaff'

const InputDisabledStaff = ({ staffId }) => {
  const { staff: staffs } = useStore()
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
    <View>
      <InputSwitch
        disabled={inputDisabled}
        value={staffDisabled}
        setValue={(value) => {
          toggleDisabled(value)
        }}
      />
    </View>
  )
}

export default InputDisabledStaff

const styles = StyleSheet.create({})
