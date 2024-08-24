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
import SpanCopy from './SpanCopy'
import LinkLocation from './LinkLocation'
import { Separator } from './Separator'

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
      <Separator />
      <Text style={gStyles.h2}>Contactos</Text>
      {store?.contacts?.map(({ label, value, type }, index) => (
        <RowInfo key={index} label={label} value={value} type={type} />
      ))}
      <Separator />
      <Text style={gStyles.h2}>Redes sociales</Text>
      {store?.socialMedia?.map(({ label, value, type }, index) => (
        <RowInfo key={index} label={label} value={value} type={type} />
      ))}
      <Separator />
      <Text style={gStyles.h2}>Cuentas de banco</Text>
      {store?.bankAccounts?.map(({ label, value, type }, index) => (
        <RowInfo key={index} label={label} value={value} type={type} />
      ))}

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

const RowInfo = ({ label, value, type }) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 4
      }}
    >
      <Text style={{ marginHorizontal: 4 }}>{type || ''}</Text>
      <Text style={{ marginHorizontal: 4 }}>{label || ''}</Text>
      <Text style={{ marginHorizontal: 4 }}>{value || ''}</Text>
    </View>
  )
}

export const StoreDetailsE = (props) => (
  <ErrorBoundary componentName="StoreDetails">
    <StoreDetails {...props} />
  </ErrorBoundary>
)

export default StoreDetails
