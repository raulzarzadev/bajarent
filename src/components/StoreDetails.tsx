import { Pressable, Text, View } from 'react-native'
import React from 'react'
import P from './P'
import StoreType from '../types/StoreType'
import { gStyles } from '../styles'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import BadgesStore from './BadgesStore'
import ErrorBoundary from './ErrorBoundary'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../theme'
import SpanCopy from './SpanCopy'
import LinkLocation from './LinkLocation'

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
              //@ts-ignore
              navigate('EditStore')
            }}
            id="editStore"
          />
        )}
      </View>
      <BadgesStore />
      <P>{store?.description}</P>
      <Text style={gStyles.h3}>Dirección</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={[gStyles.p, gStyles.tCenter]}>{store?.address} </Text>

        {store?.location && <LinkLocation location={store?.location} />}
      </View>
      <Text style={gStyles.h3}>Teléfonos</Text>
      {store?.phone && (
        <SpanCopy
          content={store?.phone}
          copyValue={store?.phone}
          label="Teléfono fijo"
        />
      )}
      {store?.mobile && (
        <SpanCopy
          content={store?.mobile}
          copyValue={store?.mobile}
          label="Teléfono móvil"
        />
      )}
      <Text style={gStyles.h3}>Cuentas bancarias</Text>
      {store?.bankInfo?.map(({ clabe, bank }) => (
        <View key={clabe}>
          <SpanCopy content={clabe} copyValue={clabe} label={bank} />
        </View>
      ))}
    </View>
  )
}

export const StoreDetailsE = (props) => (
  <ErrorBoundary componentName="StoreDetails">
    <StoreDetails {...props} />
  </ErrorBoundary>
)

export default StoreDetails
