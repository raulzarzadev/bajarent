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

const ScreenStoreSections = ({ navigation }) => {
  const { storeSections, staff } = useStore()
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
            <Pressable
              onPress={() => {
                navigation.navigate('SectionDetails', { sectionId: item.id })
              }}
              style={styles.item}
            >
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
              <View style={styles.staff}>
                <Text style={[gStyles.h3, { textAlign: 'center' }]}>
                  Staff:{' '}
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  ({item?.staff?.length || 0})
                </Text>
                {item?.staff
                  ?.map((staffId) => staff.find((s) => s.id === staffId))
                  ?.map((staff, i) => (
                    <Text key={i}>
                      {staff?.position} {staff?.name}
                    </Text>
                  ))}
              </View>
            </Pressable>
          )}
        ></FlatList>
      </View>
    </ScrollView>
  )
}

export default ScreenStoreSections

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
