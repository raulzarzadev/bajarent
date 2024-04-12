import { Text, View } from 'react-native'
import React from 'react'
import P from './P'
import StoreType from '../types/StoreType'
import ButtonIcon from './ButtonIcon'
import { useStore } from '../contexts/storeContext'
import { useStoreNavigation } from './StackStore'
import { useAuth } from '../contexts/authContext'
import { gStyles } from '../styles'
import Button from './Button'

const StoreDetails = ({ store }: { store: StoreType }) => {
  const { navigate } = useStoreNavigation()
  const { staffPermissions } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user.id
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
        {(staffPermissions?.isAdmin || isOwner) && (
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
      <P>{store.description}</P>
    </View>
  )
}

export default StoreDetails
