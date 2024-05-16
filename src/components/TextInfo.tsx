import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon, { IconName } from './Icon'
import theme, { colors } from '../theme'
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 4,
        backgroundColor: theme?.[type],
        padding: 4,
        borderRadius: 4
      }}
    >
      <Icon icon={icons[type]} color={colors.white} size={22} />
      <Text
        style={[
          gStyles.helper,
          { color: colors.white, fontWeight: 'bold', marginLeft: 8 }
        ]}
      >
        {text}
      </Text>
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
