import { PriceType } from '../types/PriceType'
import { priceTimeInSeconds } from './expireDate'

export const sortPricesByTime = (a: PriceType, b: PriceType) => {
	return priceTimeInSeconds(a.time) - priceTimeInSeconds(b.time)
}
