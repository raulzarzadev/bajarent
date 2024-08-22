import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import FormSelectPrice from './FormSelectPrice'
import { useStore } from '../contexts/storeContext'
import { PriceType } from '../types/PriceType'
import { set } from 'cypress/types/lodash'
import ErrorBoundary from './ErrorBoundary'

export type ModalSelectCategoryPriceProps = {
  categoryId: string
  handleSelectPrice: (price: Partial<PriceType>) => void
  priceSelectedId: string
}
const ModalSelectCategoryPrice = ({
  categoryId,
  handleSelectPrice,
  priceSelectedId
}: ModalSelectCategoryPriceProps) => {
  const { categories } = useStore()
  const [itemPriceSelectedId, setItemPriceSelectedId] =
    useState<string>(priceSelectedId)
  const [categoryPrices, setCategoryPrices] = useState<Partial<PriceType>[]>([])
  useEffect(() => {
    setCategoryPrices(categories.find((c) => c.id === categoryId)?.prices || [])
  }, [categories, categoryId])

  return (
    <View>
      <ButtonConfirm
        handleConfirm={async () => {
          const priceSelected = categoryPrices.find(
            (p) => p.categoryId === categoryId
          )
          handleSelectPrice(priceSelected)
        }}
        confirmLabel="Editar tiempo"
        confirmVariant="outline"
        openSize="small"
        openColor="info"
        icon="rent"
        justIcon
        modalTitle="Cambiar tiempo"
        //confirmDisabled={originalPriceId === itemPriceSelectedId}
      >
        <View style={{ marginBottom: 8 }}>
          <FormSelectPrice
            prices={categoryPrices}
            value={itemPriceSelectedId}
            setValue={(id) => {
              setItemPriceSelectedId(id)
            }}
          />
        </View>
      </ButtonConfirm>
    </View>
  )
}

export default ModalSelectCategoryPrice

export const ModalSelectCategoryPriceE = (
  props: ModalSelectCategoryPriceProps
) => (
  <ErrorBoundary componentName="ModalSelectCategoryPrice">
    <ModalSelectCategoryPrice {...props} />
  </ErrorBoundary>
)

const styles = StyleSheet.create({})
