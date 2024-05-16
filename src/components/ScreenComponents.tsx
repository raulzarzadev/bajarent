import { ScrollView } from 'react-native'
import React from 'react'
import Buttons from './Buttons'
import { InputsE } from './Inputs'
import TextInfos from './TextInfos'

const ScreenComponents = () => {
  return (
    <ScrollView>
      <Buttons />
      <InputsE />
      <TextInfos />
    </ScrollView>
  )
}

export default ScreenComponents
