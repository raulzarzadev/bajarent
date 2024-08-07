import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import theme from '../theme'

const ProgressBar = ({ progress = 0 }) => {
  return (
    <View
      style={{
        height: 4,
        backgroundColor: `${theme.info}20`,
        borderRadius: 8,
        width: '100%'
      }}
    >
      <View
        style={{
          height: 4,
          backgroundColor: theme.primary,
          borderRadius: 8,
          width: `${progress}%`
        }}
      />
    </View>
  )
}

export default ProgressBar
