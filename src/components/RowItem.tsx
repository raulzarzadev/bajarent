import { Text, View, ViewStyle } from 'react-native'
import { ItemSelected } from './FormSelectItem'
import ListRow, { ListRowField } from './ListRow'
import CurrencyAmount from './CurrencyAmount'
import { gStyles } from '../styles'

const RowItem = ({
  item,
  style
}: {
  item: Partial<ItemSelected>
  style?: ViewStyle
}) => {
  const fields: ListRowField[] = [
    {
      component: (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            numberOfLines={1}
            style={[gStyles.tBold, { textAlign: 'center', paddingRight: 4 }]}
          >
            {item.categoryName}
          </Text>
          {!!item.serial && (
            <Text style={[gStyles.helper, { textAlign: 'center' }]}>
              {item.serial}
            </Text>
          )}
        </View>
      ),
      width: 'auto'
    },
    {
      component: (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={[]}>{item.number}</Text>
        </View>
      ),
      width: 'rest'
    },

    {
      component: (
        <Text style={{ textAlign: 'center' }}>{item.priceSelected?.title}</Text>
      ),
      width: 70
    },
    {
      component: (
        <CurrencyAmount
          style={{ ...gStyles.tBold, textAlign: 'center' }}
          amount={(item.priceSelected?.amount || 0) * (item.priceQty || 1)}
        />
      ),
      width: 80
    }
  ]
  return (
    <ListRow fields={fields} style={{ borderColor: 'transparent', ...style }} />
  )
}

export default RowItem
