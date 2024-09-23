import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import theme, { Colors } from '../theme'

const ProgressBar = ({
  progress = 0,
  color = 'primary',
  trackColor = 'info'
}: {
  progress: number
  color?: Colors
  trackColor?: Colors
}) => {
  return (
    <View
      style={{
        height: 4,
        backgroundColor: `${theme?.[trackColor]}30`,
        borderRadius: 8,
        width: '100%'
      }}
    >
      <View
        style={{
          height: 4,
          backgroundColor: theme[color],
          borderRadius: 8,
          width: `${progress}%`
        }}
      />
    </View>
  )
}

export default ProgressBar
