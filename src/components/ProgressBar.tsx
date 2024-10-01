import React from 'react'
import { Text, View } from 'react-native'
import theme, { Colors } from '../theme'
import { gStyles } from '../styles'

const ProgressBar = ({
  progress = 0,
  color = 'primary',
  trackColor = 'info',
  size = 'md',
  hideWhenFull = false,
  showPercent = false
}: {
  progress: number
  color?: Colors
  trackColor?: Colors
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hideWhenFull?: boolean
  showPercent?: boolean
}) => {
  const sizes = {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8
  }
  if (hideWhenFull && (progress === 100 || !progress)) return null

  return (
    <>
      {showPercent && (
        <Text style={[gStyles.helper, { textAlign: 'center', width: '100%' }]}>
          {progress}%
        </Text>
      )}
      <View
        style={{
          height: sizes[size],
          backgroundColor: `${theme?.[trackColor]}30`,
          borderRadius: 8,
          width: '100%'
        }}
      >
        <View
          style={{
            height: sizes[size],
            backgroundColor: theme[color],
            borderRadius: 8,
            width: `${progress || 0}%`
          }}
        ></View>
      </View>
    </>
  )
}

export default ProgressBar
