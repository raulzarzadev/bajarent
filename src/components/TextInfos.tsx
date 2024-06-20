import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TextInfo from './TextInfo'

const TextInfos = () => {
  return (
    <View>
      <TextInfo
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam."
        type="error"
      />
      <TextInfo
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam."
        type="info"
      />
      <TextInfo
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam."
        type="success"
      />
      <TextInfo
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam."
        type="warning"
      />
    </View>
  )
}

export default TextInfos

const styles = StyleSheet.create({})
