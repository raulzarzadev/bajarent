import { View } from 'react-native'
import OrderType from '../types/OrderType'
import ImagePreview from './ImagePreview'

const OrderImages = ({ order }: { order: Partial<OrderType> }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap'
      }}
    >
      {!!order?.imageID && (
        <ImagePreview
          image={order?.imageID}
          title="Imagen ID"
          width={100}
          height={100}
        />
      )}
      {!!order?.imageHouse && (
        <ImagePreview
          image={order?.imageHouse}
          title="Imagen Casa"
          width={100}
          height={100}
        />
      )}
      {!!order?.signature && (
        <ImagePreview
          image={order?.signature}
          title="signature"
          width={100}
          height={100}
        />
      )}
    </View>
  )
}

export default OrderImages
