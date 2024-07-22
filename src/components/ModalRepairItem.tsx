import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { gStyles } from '../styles'
import { useOrderDetails } from '../contexts/orderContext'
import FormRepairItem from './FormRepairItem'
import { useStore } from '../contexts/storeContext'
import OrderType from '../types/OrderType'

export const ModalRepairItem = ({}) => {
  const { order } = useOrderDetails()
  const modal = useModal({ title: 'Artículo' })
  const item = order.item

  return (
    <>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8
          }}
        >
          <Text style={gStyles.h2}>Artículo </Text>
          <Button
            variant="ghost"
            size="small"
            justIcon
            icon="edit"
            color="primary"
            onPress={modal.toggleOpen}
          />
        </View>
        {item ? (
          <RepairItemDetails item={item} />
        ) : (
          <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
            No hay artículo
          </Text>
        )}
      </View>

      <StyledModal {...modal}>
        <FormRepairItem
          defaultValues={{ ...item }}
          onSubmit={async (values) => {
            await ServiceOrders.update(order.id, { item: values })
              .then((res) => console.log({ res }))
              .catch(console.error)
            modal.toggleOpen()
            return
          }}
        />
      </StyledModal>
    </>
  )
}

export const RepairItemDetails = ({ item }: { item: OrderType['item'] }) => {
  const itemCategoryId = item?.categoryId
  const { categories } = useStore()
  const categoryName = itemCategoryId
    ? categories.find((c) => c.id === itemCategoryId)?.name
    : ''
  return (
    <View>
      <Text style={styles.title}>Categoria:</Text>
      <Text style={styles.value}>{categoryName}</Text>
      <Text style={styles.title}>Marca:</Text>
      <Text style={styles.value}>{item?.brand}</Text>
      <Text style={styles.title}>Serie:</Text>
      <Text style={styles.value}>{item?.serial}</Text>

      <Text style={styles.title}>Falla</Text>
      <Text style={styles.value}>{item?.failDescription}</Text>
    </View>
  )
}

export default ModalRepairItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  item: {
    width: '48%', // for 2 items in a row
    marginVertical: '1%' // spacing between items
  },
  repairItemForm: {
    marginVertical: 4
  },
  title: {
    ...gStyles.helper,
    textAlign: 'center'
  },
  value: {
    ...gStyles.tBold,
    textAlign: 'center'
  }
})
