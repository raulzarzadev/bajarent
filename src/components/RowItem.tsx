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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={[gStyles.tBold, { textAlign: 'center' }]}>
            {item.categoryName}
          </Text>
          {item.number && (
            <Text
              style={[
                //gStyles.helper,
                gStyles.tCenter,
                { marginLeft: 4, alignItems: 'center' }
              ]}
            >
              {item.number}
            </Text>
          )}
        </View>
      ),
      width: 'rest'
    },
    {
      component: (
        <Text style={{ textAlign: 'center' }}>{item.priceSelected?.title}</Text>
      ),
      width: 80
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
