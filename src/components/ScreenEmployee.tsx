import { Dimensions } from 'react-native'
import React from 'react'
import { FormEmployeePermissionsE } from './FormEmployeePermissions'
const screenWidth = Dimensions.get('window').width

const ScreenEmployee = (props: { staffId: string }) => (
  <FormEmployeePermissionsE staffId={props.staffId} />
)

export default ScreenEmployee
