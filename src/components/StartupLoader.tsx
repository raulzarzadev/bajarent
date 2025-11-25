import { ActivityIndicator, Text, View } from 'react-native'
import React from 'react'
import { gStyles } from '../styles'
import theme from '../theme'

export type StartupLoaderProps = {
  title: string
  description?: string
}

const StartupLoader = ({ title, description }: StartupLoaderProps) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: theme.white
      }}
    >
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[gStyles.h2, { marginTop: 16, textAlign: 'center' }]}>
        {title}
      </Text>
      {!!description && (
        <Text style={[gStyles.helper, { textAlign: 'center', marginTop: 4 }]}>
          {description}
        </Text>
      )}
    </View>
  )
}

export default StartupLoader
