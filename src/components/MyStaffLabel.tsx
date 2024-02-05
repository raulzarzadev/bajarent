import { Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'

const MyStaffLabel = () => {
  const { myStaffId, staff } = useStore()
  const label = staff?.find((s) => s.id === myStaffId)?.position
  return (
    <View>
      <Text style={[gStyles.h3, { marginRight: 8 }]}>{label}</Text>
    </View>
  )
}

export default MyStaffLabel
