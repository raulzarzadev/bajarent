import { Text, View } from 'react-native'
import React from 'react'
import P from './P'
import StoreType from '../types/StoreType'
import { useStore } from '../contexts/storeContext'
import { useStoreNavigation } from './StackStore'
import { gSpace, gStyles } from '../styles'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import BadgeAdmin from './BadgeAdmin'
import BadgeOwner from './BadgeOwner'
import BadgesStore from './BadgesStore'

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
      <P>{store.description}</P>
    </View>
  )
}

export default StoreDetails
