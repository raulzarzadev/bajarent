import { StyleSheet, Text, View } from 'react-native'
import { useOrderDetails } from '../contexts/orderContext'
import { useStore } from '../contexts/storeContext'
import { SaleOrderItem } from '../types/OrderType'
import ErrorBoundary from './ErrorBoundary'
import CurrencyAmount from './CurrencyAmount'
import { gStyles } from '../styles'
import theme from '../theme'

export const SaleItemsInfo = () => {
  const { order } = useOrderDetails()
  const { categories } = useStore()
  const items = order?.items as SaleOrderItem[]
  const total = items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  return (
    <ErrorBoundary componentName="SaleItemsInfo">
      <View
        style={{
          marginVertical: 16,
          paddingVertical: 16,
          backgroundColor: theme?.base,
          width: '100%'
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>
            Categoria
          </Text>
          <Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>
            Serie
          </Text>
          <Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>
            Precio
          </Text>
          <Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>
            Cantidad
          </Text>
          <Text style={[styles.saleItemCell, styles.saleItemCellTitle]}>
            Monto
          </Text>
        </View>

        {items?.map((item, i) => (
          <View
            key={item.id || i}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.saleItemCell}>
              {categories?.find((cat) => cat.id === item.category)?.name}
            </Text>
            <Text style={styles.saleItemCell}>{item.serial}</Text>
            <CurrencyAmount style={styles.saleItemCell} amount={item.price} />
            <Text style={styles.saleItemCell}>{item.quantity}</Text>
            <CurrencyAmount
              style={styles.saleItemCell}
              amount={item.price * item.quantity}
            />
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 8
          }}
        >
          <Text>Total: </Text>
          <CurrencyAmount amount={total} style={gStyles.h3} />
        </View>
      </View>
    </ErrorBoundary>
  )
}

const styles = StyleSheet.create({
  saleItemCell: {
    width: '20%',
    textAlign: 'center',
    padding: 4
  },
  saleItemCellTitle: {
    fontWeight: 'bold'
  }
})

export type SaleItemsInfoProps = {}
export const SaleItemsInfoE = (props: SaleItemsInfoProps) => (
  <ErrorBoundary componentName="SaleItemsInfo">
    <SaleItemsInfo {...props} />
  </ErrorBoundary>
)
