import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { gSpace, gStyles } from '../styles'
import theme from '../theme'
import { useStore } from '../contexts/storeContext'
import StaffType from '../types/StaffType'
import { SectionType } from '../types/SectionType'

const ListSections = ({
  sectionsSelected = [],
  sections = [],
  onPress = (id: string) => console.log(id),
  showStaff = false
}: {
  sectionsSelected?: string[]
  sections: SectionType[]
  onPress: (id: string) => void
  showStaff?: boolean
}) => {
  const { staff } = useStore()
  return (
    <FlatList
      style={{
        padding: 6,
        maxWidth: 400,
        width: '100%',
        marginHorizontal: 'auto'
      }}
      data={sections}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            onPress(item.id)
            // navigation.navigate('SectionDetails', { sectionId: item.id })
          }}
          style={[
            styles.item,
            sectionsSelected?.includes(item?.id) && {
              borderColor: theme.secondary
            }
          ]}
        >
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
          {showStaff && (
            <View style={styles.staff}>
              <Text style={[gStyles.h3, { textAlign: 'center' }]}>Staff: </Text>
              <Text style={{ textAlign: 'center' }}>
                ({item?.staff?.length || 0})
              </Text>
              {item?.staff
                ?.map((staffId: string) => staff.find((s) => s.id === staffId))
                ?.map((staff: StaffType, i: number) => (
                  <Text key={i}>{staff?.name}</Text>
                ))}
            </View>
          )}
        </Pressable>
      )}
    ></FlatList>
  )
}

export default ListSections

const styles = StyleSheet.create({
  item: {
    padding: gSpace(3),
    backgroundColor: theme.info,
    marginVertical: gSpace(2),
    borderRadius: gSpace(2),
    borderWidth: 2,
    borderColor: 'transparent'
  },
  staff: {
    maxWidth: 350,
    width: '100%',
    margin: 'auto'
  }
})
