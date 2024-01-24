import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Chip as RNEChip } from 'react-native-elements'
import dictionary from '../dictionary'

const Chip = ({
  title,
  color,
  titleColor,
  size = 'md'
}: {
  title: string
  color: string
  titleColor: string
  size?: 'sm' | 'md' | 'lg'
}) => {
  const sizes = {
    sm: {
      fontSize: 10,
      padding: 5
    },
    md: {
      fontSize: 12,
      padding: 8
    },
    lg: {
      fontSize: 14,
      padding: 10
    }
  }
  console.log({ color })
  return (
    <RNEChip
      title={title}
      buttonStyle={{
        padding: sizes[size].padding,
        backgroundColor: color
      }}
      titleStyle={{
        color: titleColor,
        fontSize: sizes[size].fontSize,
        fontWeight: 'bold'
      }}
    />
  )
}

export default Chip

const styles = StyleSheet.create({})
