import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { gSpace, gStyles } from '../styles'
import theme from '../theme'
import { CategoryType } from '../types/RentItem'
import ButtonIcon from './ButtonIcon'
import { useNavigation } from '@react-navigation/native'
import ButtonConfirm from './ButtonConfirm'
import { CardPrice } from './FormSelectItem'
import { PriceType } from '../types/PriceType'
import { useStore } from '../contexts/storeContext'
import ModalFormPrice from './ModalFormPrice'
import useCategories from '../hooks/useCategories'
import usePrices from '../hooks/usePrices'

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
  const { categories, storeId, updateCategories } = useStore()

  const { deleteCategory, createPrice, deletePrice, updatePrice } =
    useCategories()

  const [priceSelected, setPriceSelected] = useState<string | null>(null)

  const handleSelectPrice = (id: string) => {
    setPriceSelected(id)
  }
  const handleDeletePrice = async (id: string) => {
    await deletePrice(id)
    updateCategories()
  }
  const handleEditPrice = async (id: string, values: Partial<PriceType>) => {
    await updatePrice(id, values)
    updateCategories()
  }
  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
    updateCategories()
  }
  const [categoryPrices, setCategoryPrices] = useState<Partial<PriceType>[]>([])

  useEffect(() => {
    setCategoryPrices(categories.find((c) => c.id === selected)?.prices || [])
  }, [selected, categories])

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
                handleDeleteCategory(selected)
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
        {!!categoryPrices.length && (
          <>
            {/* {defaultValues?.id && (
            <View
              style={[
                styles.input,
                { flexDirection: 'row', alignItems: 'center' }
              ]}
            >
              <Text style={[gStyles.h3, { marginRight: 8 }]}>Precios</Text>
              <ModalFormPrice
                handleSubmit={async (price) => {
                  return await createPrice(price, storeId, categoryId)
                }}
              />
            </View>
          )}
          <View style={styles.input}>
            <FlatList
              horizontal
              data={categoryPrices}
              renderItem={({ item }) => (
                <CardPrice
                  style={{ marginVertical: 8, marginRight: 8 }}
                  price={item}
                />
              )}
            ></FlatList>
          </View> */}
            <View
              style={[
                // styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 4
                }
              ]}
            >
              <Text style={[gStyles.h3, { marginRight: 8 }]}>Precios</Text>
              <ModalFormPrice
                variant="ghost"
                handleSubmit={async (price) => {
                  return await createPrice(price, storeId, selected)
                }}
              />
            </View>
            <FlatList
              horizontal
              data={categoryPrices}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'column' }}>
                  <Pressable onPress={() => handleSelectPrice(item.id)}>
                    <CardPrice
                      style={{ marginRight: 8 }}
                      price={item}
                      selected={priceSelected === item.id}
                    />
                  </Pressable>
                  {priceSelected === item.id && (
                    <View
                      style={{ alignSelf: 'flex-end', flexDirection: 'row' }}
                    >
                      <ButtonConfirm
                        confirmColor="error"
                        openColor="error"
                        openVariant="ghost"
                        icon="delete"
                        handleConfirm={() => handleDeletePrice(item.id)}
                        justIcon
                        text="Eliminar precio"
                      />

                      <ModalFormPrice
                        icon="edit"
                        variant="ghost"
                        values={item}
                        handleSubmit={async (values) => {
                          await handleEditPrice(item.id, values)
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
            ></FlatList>
          </>
        )}
      </View>
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
