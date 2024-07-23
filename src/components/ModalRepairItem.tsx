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
import { use } from 'chai'

export const ModalRepairItem = ({}) => {
  const { order } = useOrderDetails()
  const { categories } = useStore()
  const modal = useModal({ title: 'Artículo' })
  const item = order?.item
  const categoryName =
    categories.find((cat) => cat?.id === item?.categoryId)?.name || ''
  const formattedItem = {
    categoryName,
    categoryId: item?.categoryId || '',
    brand: item?.brand || order?.itemBrand || '',
    serial: item?.serial || order?.itemSerial || '',
    failDescription: item?.failDescription || order?.description || ''
  }

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
        {formattedItem ? (
          <RepairItemDetails item={formattedItem} />
        ) : (
          <Text style={{ justifyContent: 'center', textAlign: 'center' }}>
            No hay artículo
          </Text>
        )}
      </View>

      <StyledModal {...modal}>
        <FormRepairItem
          defaultValues={{ ...formattedItem }}
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

export const RepairItemDetails = ({
  item = {}
}: {
  item: OrderType['item']
}) => {
  const { categoryName, brand, serial, failDescription } = item
  return (
    <View>
      {categoryName && (
        <>
          <Text style={styles.title}>Categoria:</Text>
          <Text style={styles.value}>{categoryName}</Text>
        </>
      )}
      {brand && (
        <>
          <Text style={styles.title}>Marca:</Text>
          <Text style={styles.value}>{brand}</Text>
        </>
      )}
      {serial && (
        <>
          <Text style={styles.title}>Serie:</Text>
          <Text style={styles.value}>{serial}</Text>
        </>
      )}
      {failDescription && (
        <>
          <Text style={styles.title}>Falla</Text>
          <Text style={styles.value}>{failDescription}</Text>
        </>
      )}
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
