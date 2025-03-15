import { StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import ButtonConfirm from './ButtonConfirm'
import FormSelectPrice from './FormSelectPrice'
import { useStore } from '../contexts/storeContext'
import { PriceType } from '../types/PriceType'
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
    setCategoryPrices(
      categories?.find((c) => c.id === categoryId)?.prices || []
    )
  }, [categories, categoryId])

  //console.log({ categories, categoryPrices, categoryId })

  return (
    <View>
      <ButtonConfirm
        openDisabled={categoryPrices.length === 0}
        handleConfirm={async () => {
          const itemPriceSelected = categoryPrices.find(
            //* this is necessary to find the correct price
            (p) => p.id === itemPriceSelectedId
          )
          const categoryPriceSelected = categoryPrices.find(
            //* FIXME: this was moved in the past. we need to check if it's still necessary
            (p) => p.categoryId === categoryId
          )

          // console.log({ categoryPriceSelected, itemPriceSelected })
          handleSelectPrice(itemPriceSelected)
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
