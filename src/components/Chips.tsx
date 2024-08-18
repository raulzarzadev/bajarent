import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Chip from './Chip'
import theme from '../theme'
import Icon from './Icon'
import { gStyles } from '../styles'

const Chips = () => {
  return (
    <View>
      <Text style={gStyles.h2}>Colores</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginVertical: 16,
          justifyContent: 'space-around'
        }}
      >
        <Chip title={'Buenos dias'} color={theme.primary} />
        <Chip title={'Buenos dias'} color={theme.secondary} />
        <Chip title={'Buenos dias'} color={theme.error} />
        <Chip title={'Buenos dias'} color={theme.success} />
        <Chip title={'Buenos dias'} color={theme.warning} />
      </View>
      <Text style={gStyles.h2}>Iconos</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginVertical: 16,
          justifyContent: 'space-around'
        }}
      >
        <Chip title={'Agregar'} icon={'add'} color={theme.warning} />
        <Chip title={'Calendario'} icon={'calendar'} color={theme.primary} />
        <Chip
          title={'Camion '}
          icon={'truck'}
          color={theme.secondary}
          titleColor={theme.white}
        />
        <Chip title={'hecho'} icon={'done'} color={theme.success} />
      </View>
      <Text style={gStyles.h2}>Tamaño</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginVertical: 16,
          justifyContent: 'space-around'
        }}
      >
        <Chip title={'Cerrar'} icon={'close'} color={theme.error} size="lg" />
        <Chip title={'Cerrar'} icon={'close'} color={theme.error} size="md" />
        <Chip title={'Cerrar'} icon={'close'} color={theme.error} size="sm" />
        <Chip title={'Cerrar'} icon={'close'} color={theme.error} size="xs" />
      </View>
    </View>
  )
}

export default Chips

const styles = StyleSheet.create({})
