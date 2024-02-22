import React, { useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { gSpace, gStyles } from '../styles'
import theme from '../theme'
import { CategoryType } from '../types/RentItem'
import ItemType from '../types/ItemType'
import ButtonIcon from './ButtonIcon'
import { useNavigation } from '@react-navigation/native'
import ButtonConfirm from './ButtonConfirm'
import useCategories from '../hooks/useCategories'

const ScreenItems = () => {
  return (
    <View style={gStyles.container}>
      <StoreCategories />
    </View>
  )
}

const StoreCategories = () => {
  const [selected, setSelected] = useState<string | null>(null)
  const { navigate } = useNavigation()
  const { categories, deleteCategory } = useCategories()

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={[
            gStyles.h3,
            {
              textAlign: 'left'
            }
          ]}
        >
          Categorias{' '}
        </Text>
        <ButtonIcon
          icon="add"
          variant="ghost"
          onPress={() => {
            // @ts-ignore
            navigate('CreateCategory')
          }}
        ></ButtonIcon>
        {selected && (
          <>
            <ButtonConfirm
              justIcon
              openVariant="ghost"
              icon="delete"
              openColor="error"
              confirmColor="error"
              handleConfirm={async () => {
                deleteCategory(selected)
              }}
              text="¿Estás seguro de eliminar esta categoría?"
            />
            <ButtonIcon
              icon="edit"
              variant="ghost"
              color="secondary"
              onPress={() => {
                // @ts-ignore
                navigate('EditCategory', { id: selected })
              }}
            ></ButtonIcon>
          </>
        )}
      </View>
      <View>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => {
            return (
              <Pressable onPress={() => setSelected(item.id)}>
                <CategorySquare item={item} selected={selected === item.id} />
              </Pressable>
            )
          }}
        ></FlatList>
      </View>
      <View>
        {/* <FlatList
          data={CATEGORIES_ITEMS.items}
          renderItem={({ item }) => {
            return (
              <Pressable>
                <ItemSquare item={item} />
              </Pressable>
            )
          }}
        ></FlatList> */}
      </View>
    </View>
  )
}
const ItemSquare = ({ item }: { item: Partial<ItemType> }) => {
  return (
    <View style={styles.row}>
      <Text style={gStyles.h3}>{item.number}</Text>
    </View>
  )
}
const CategorySquare = ({
  item,
  selected
}: {
  item: Partial<CategoryType>
  selected?: boolean
}) => {
  return (
    <View style={[styles.square, selected && { borderColor: theme.black }]}>
      <Text style={gStyles.h3}>{item.name}</Text>
    </View>
  )
}

export default ScreenItems

const styles = StyleSheet.create({
  square: {
    height: 80,
    width: 140,
    margin: gSpace(2),
    marginLeft: 0,
    backgroundColor: theme.info,
    borderRadius: gSpace(2),
    padding: gSpace(1),
    borderColor: 'transparent',
    borderWidth: gSpace(0.5)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: gSpace(1),
    margin: gSpace(1),
    backgroundColor: theme.info,
    borderRadius: gSpace(2)
  }
})
