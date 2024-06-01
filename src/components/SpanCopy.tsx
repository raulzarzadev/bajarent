import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { colors } from '../theme'

const SpanCopy = ({ label, copyValue, content = '' }) => {
  const [copied, setCopied] = React.useState(false)
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', marginRight: 4 }}>{label}</Text>
      <Text>
        {content}
        {copied && (
          <View
            style={[
              {
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: colors.emerald,
                padding: 3,
                borderRadius: 4
              }
            ]}
          >
            <Text>Copiado!</Text>
          </View>
        )}
      </Text>
      <Button
        icon="copy"
        justIcon
        variant="ghost"
        size="small"
        onPress={() => {
          //@ts-ignore
          navigator.clipboard.writeText(copyValue)
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 2000)
        }}
      />
    </View>
  )
}

export default SpanCopy

const styles = StyleSheet.create({})
