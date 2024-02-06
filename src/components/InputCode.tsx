import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, StyleSheet, View } from 'react-native'

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field'
import theme from '../theme'

const DEFAULT_CELL_COUNT = 6

const InputCode = ({ value, setValue, cellCount = DEFAULT_CELL_COUNT }) => {
  // const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  })

  useEffect(() => {
    ref.current.focus()
  }, [])

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Codigo de verificación</Text>
      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={cellCount}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text>{symbol || (isFocused ? <Cursor /> : null)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default InputCode

const styles = StyleSheet.create({
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  cellRoot: {
    width: 35,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: theme.neutral,
    borderBottomWidth: 1
  },
  cellText: {
    color: theme.black,
    fontSize: 36,
    textAlign: 'center'
  },
  focusCell: {
    borderBottomColor: theme.secondary,
    borderBottomWidth: 2
  }
})
