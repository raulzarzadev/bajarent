import { ScrollView } from 'react-native'
import React from 'react'
import Buttons from './Buttons'
import { InputsE } from './Inputs'
import TextInfos from './TextInfos'
import Chips from './Chips'

const ScreenComponents = () => {
  return (
    <ScrollView>
      <Buttons />
      <InputsE />
      <TextInfos />
      <Chips />
    </ScrollView>
  )
}

export default ScreenComponents
