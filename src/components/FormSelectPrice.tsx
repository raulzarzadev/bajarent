import {
  View,
  Text,
  FlatList,
  Pressable,
  ViewStyle,
  StyleSheet
} from 'react-native'
import { PriceType } from '../types/PriceType'
import P from './P'
import theme, { colors } from '../theme'
import CurrencyAmount from './CurrencyAmount'
import { sortPricesByTime } from '../libs/prices'
const FormSelectPrice = ({
  prices,
  value,
  setValue
}: {
  prices: Partial<PriceType>[]
  value: PriceType['id'] | null
  setValue: (priceId: PriceType['id']) => void
}) => {
  return (
    <>
      <View>
        {!!prices.length && (
          <P bold size="lg">
            Precios
          </P>
        )}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <FlatList
          data={prices.sort(sortPricesByTime)}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              onPress={() => {
                setValue(item.id)
              }}
            >
              <CardPrice
                price={item}
                selected={value === item.id}
                style={{
                  marginRight: 8,
                  marginVertical: 8
                }}
              />
            </Pressable>
          )}
          keyExtractor={(item) => item.title}
          horizontal
        ></FlatList>
      </View>
    </>
  )
}

export const CardPrice = ({
  price,
  style,
  selected
}: {
  price: Partial<PriceType>
  style?: ViewStyle
  selected?: boolean
}) => {
  return (
    <View
      style={[
        styles.price,
        style,
        { backgroundColor: selected ? theme.primary : colors.white }
      ]}
    >
      <Text style={{ textAlign: 'center', marginBottom: 4 }}>
        {price.title}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        <CurrencyAmount amount={price.amount || 0} />
      </Text>
    </View>
  )
}

export default FormSelectPrice

const styles = StyleSheet.create({
  price: {
    width: 100,
    aspectRatio: '2/1',
    backgroundColor: theme.primary,
    borderRadius: 8,
    // borderColor: theme.secondary,
    // borderColor: 'black',
    //borderWidth: 2,
    shadowColor: theme.black,
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowRadius: 4,
    shadowOpacity: 0.25,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
