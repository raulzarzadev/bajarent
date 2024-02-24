import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import theme from '../theme'
import { gSpace, gStyles } from '../styles'
import StaffRow from './StaffRow'

const ScreenSections = ({ navigation }) => {
  const { storeSections } = useStore()

  return (
    <ScrollView>
      <Button
        buttonStyles={{
          margin: 'auto',
          marginVertical: 16
        }}
        onPress={() => {
          navigation.navigate('CreateSection')
        }}
      >
        Agregar area
      </Button>
      <View style={gStyles.container}>
        <FlatList
          data={storeSections}
          renderItem={({ item }) => (
            <SectionRow
              section={item}
              onPress={(sectionId) => {
                navigation.navigate('SectionDetails', { sectionId })
              }}
            />
          )}
        ></FlatList>
      </View>
    </ScrollView>
  )
}

export const SectionRow = ({
  section,
  onPress
}: {
  section
  onPress: (sectionId: string) => void
}) => {
  return (
    <View
      // onPress={() => {
      //   onPress(section.id)
      // }}
      style={styles.item}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ width: '100%' }}>{section?.name}</Text>
        <Button
          icon="verticalDots"
          justIcon
          label="Ver"
          onPress={() => onPress(section.id)}
        ></Button>
      </View>
      <Text>{section?.description}</Text>
      <View style={styles.staff}>
        <Text style={[gStyles.h3, { textAlign: 'center' }]}>Staff: </Text>
        <Text style={{ textAlign: 'center' }}>
          ({section?.staff?.length || 0})
        </Text>
        {section?.staff?.map((staffId) => (
          <StaffRow key={staffId} staffId={staffId} sectionId={section.id} />
        ))}
      </View>
    </View>
  )
}

export default ScreenSections

const styles = StyleSheet.create({
  item: {
    padding: gSpace(3),
    backgroundColor: theme.info,
    marginVertical: gSpace(2),
    borderRadius: gSpace(2)
  },
  staff: {
    maxWidth: 350,
    width: '100%',
    margin: 'auto'
  }
})
