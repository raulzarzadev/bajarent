import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon, { IconName } from './Icon'
import theme from '../theme'
import { gStyles } from '../styles'

export type TextIconType = 'info' | 'error' | 'success'
export type TextInfoProps = {
  type?: TextIconType
  text: string
}
const TextInfo = ({ type = 'info', text }: TextInfoProps) => {
  const icons: Record<TextIconType, IconName> = {
    info: 'info',
    error: 'cancel',
    success: 'done'
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 4
      }}
    >
      <Icon icon={icons[type]} color={theme?.[type]} size={16} />
      <Text style={[gStyles.helper, { color: theme?.[type] }]}>{text}</Text>
    </View>
  )
}

export default TextInfo

const styles = StyleSheet.create({
  text: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    verticalAlign: 'center'
  }
})
