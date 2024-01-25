import React, { useState } from 'react'
import { View, Text, ViewStyle } from 'react-native'
import RNPhoneInput, { ICountry } from 'react-native-international-phone-number'

type PhoneInputProps = {
  defaultNumber?: string
  stylesContainer?: ViewStyle
  stylesInput?: ViewStyle
  onChange?: (phoneNumber: string) => void
}
export default function InputPhone({
  defaultNumber = '+52',
  stylesContainer,
  onChange = (phoneNumber: string) => console.log(phoneNumber)
}: //stylesInput
PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null)
  const [inputValue, setInputValue] = useState<string>('')

  function handleInputValue(phoneNumber: string) {
    onChange &&
      onChange((selectedCountry?.callingCode + phoneNumber).replaceAll(' ', ''))
    setInputValue(phoneNumber)
  }

  function handleSelectedCountry(country: ICountry) {
    onChange &&
      onChange((country?.callingCode + inputValue).replaceAll(' ', ''))
    setSelectedCountry(country)
  }

  return (
    <View style={[{ width: '100%' }, stylesContainer]}>
      <RNPhoneInput
        customMask={['## ## ## ## ##']}
        language="es"
        defaultValue={defaultNumber}
        value={inputValue}
        defaultCountry="MX"
        onChangePhoneNumber={handleInputValue}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
        popularCountries={['MX', 'CA', 'US']}
      />
    </View>
  )
}
