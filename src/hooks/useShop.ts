import { useSelector } from 'react-redux'
import { selectShop } from '../state/features/shop/shopSlice'

export const useShop = () => {
  const shop = useSelector(selectShop)
  return { shop }
}
