import ItemType, { ItemBase, ItemStatus } from '../types/ItemType'
import { CategoryType } from '../types/RentItem'

const WASHER_CATEGORY_ID = 'washer'
const DRYER_CATEGORY_ID = 'dryer'

// Crear 5 lavadoras
const washers: ItemBase[] = Array(5)
  .fill(null)
  .map((_, index) => ({
    number: `Washer${index + 1}`,
    serial: `W${index + 1}SERIAL`,
    brand: 'BrandName',
    status: 'available' as ItemStatus,
    category: WASHER_CATEGORY_ID
  }))

// Crear 5 secadoras
const dryers: ItemBase[] = Array(5)
  .fill(null)
  .map((_, index) => ({
    number: `Dryer${index + 1}`,
    serial: `D${index + 1}SERIAL`,
    brand: 'BrandName',
    status: 'available' as ItemStatus,
    category: DRYER_CATEGORY_ID
  }))

const CATEGORIES_ITEMS: {
  categories: Partial<CategoryType>[]
  items: ItemBase[]
} = {
  categories: [
    {
      name: 'Lavadora',
      id: 'lavadora',
      description: 'Lavadoras de ropa',
      prices: [
        {
          title: '1 semana',
          amount: 300,
          time: '1 week',
          storeId: '1',
          categoryId: 'lavadora'
        },
        {
          id: '2',
          title: '2 semanas',
          amount: 450,
          time: '2 week',
          storeId: '1',
          categoryId: 'lavadora'
        },
        {
          id: '3',
          title: '1 mes',
          amount: 600,
          time: '1 month',
          storeId: '1',
          categoryId: 'lavadora'
        },
        {
          id: '4',
          title: '1 mes*',
          amount: 700,
          time: '1 month',
          storeId: '1',
          categoryId: 'lavadora'
        }
      ]
    },
    {
      name: 'Secadora',
      id: 'secadora',
      prices: [
        {
          id: '5',
          title: '1 minuto',
          amount: 100,
          time: '1 minute'
        },
        {
          id: '8',
          title: '5 minutos',
          amount: 100,
          time: '5 minute'
        },
        {
          id: '9',
          title: '1 dia',
          amount: 100,
          time: '1 day'
        },
        {
          id: '10',
          title: '1 año',
          amount: 100,
          time: '1 year'
        }
      ]
    }
  ],
  items: [...washers, ...dryers]
}

export default CATEGORIES_ITEMS
