import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SpanMetadata from './SpanMetadata'
import { gStyles } from '../styles'
import ImagePreview from './ImagePreview'
import { ClientType } from '../types/ClientType'
import ErrorBoundary from './ErrorBoundary'

export type CardClientProps = {
  client: Partial<ClientType>
}
export const CardClient = ({ client }: CardClientProps) => {
  return (
    <View style={{ justifyContent: 'center', marginVertical: 6 }}>
      <SpanMetadata
        createdAt={client?.createdAt}
        createdBy={client?.createdBy}
        id={client?.id}
        layout="row"
      />
      <Text style={[gStyles.h3]}>{client?.name}</Text>
      <Text style={[gStyles.tCenter]}>{client?.phone}</Text>
      <Text style={[gStyles.tCenter]}>{client?.address || ''}</Text>
      <Text style={[gStyles.tCenter]}>{client?.neighborhood || ''}</Text>

      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        {client?.imageID && <ImagePreview image={client?.imageID} />}
        {client?.imageHouse && <ImagePreview image={client?.imageHouse} />}
      </View>
    </View>
  )
}

export const CardClientE = (props: CardClientProps) => (
  <ErrorBoundary componentName="CardClient">
    <CardClient {...props} />
  </ErrorBoundary>
)

export default CardClient

const styles = StyleSheet.create({})
