import { StyleSheet } from 'react-native'
import ItemsStats from './ItemsStats'

const ScreenItemsStatus = () => {
  //FIXME: orders is not defined
  const orders = []
  return <ItemsStats orders={orders} />
}

export default ScreenItemsStatus

const styles = StyleSheet.create({})
