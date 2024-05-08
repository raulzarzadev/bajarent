import { Text, View } from 'react-native'
import React from 'react'
import P from './P'
import StoreType from '../types/StoreType'
import { gStyles } from '../styles'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import BadgesStore from './BadgesStore'
import ErrorBoundary from './ErrorBoundary'
import { useNavigation } from '@react-navigation/native'

const StoreDetails = ({ store }: { store: StoreType }) => {
  const { navigate } = useNavigation()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* <ChangeStore /> */}
        <Text style={gStyles.h1}>{store?.name}</Text>

        {(isAdmin || isOwner) && (
          <Button
            color="secondary"
            variant="ghost"
            justIcon
            icon="settings"
            onPress={() => {
              navigate('EditStore')
            }}
            id="editStore"
          />
        )}
      </View>
      <BadgesStore />
      <P>{store?.description}</P>
    </View>
  )
}

export const StoreDetailsE = (props) => (
  <ErrorBoundary componentName="StoreDetails">
    <StoreDetails {...props} />
  </ErrorBoundary>
)

export default StoreDetails
