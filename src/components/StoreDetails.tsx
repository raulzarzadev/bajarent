import { Text, View } from 'react-native'
import React from 'react'
import P from './P'
import StoreType from '../types/StoreType'
import { useStoreNavigation } from './StackStore'
import { gStyles } from '../styles'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext2'
import BadgesStore from './BadgesStore'
import ErrorBoundary from './ErrorBoundary'

const StoreDetails = ({ store }: { store: StoreType }) => {
  const { navigate } = useStoreNavigation()
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
