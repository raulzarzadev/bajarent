import { Category } from '../types/RentItem'

const CATEGORIES_ITEMS: { categories: Category[] } = {
  categories: [
    {
      name: 'Lavadora',
      id: 'lavadora',
      prices: [
        {
          id: '5',
          title: '1 minuto',
          amount: 100,
          time: '1 minute'
        },
        {
          id: '1',
          title: '1 semana',
          amount: 300,
          time: '1 week'
        },
        {
          id: '2',
          title: '2 semanas',
          amount: 450,
          time: '2 week'
        },
        {
          id: '3',
          title: '1 mes',
          amount: 600,
          time: '1 month'
        },
        {
          id: '4',
          title: '1 mes*',
          amount: 700,
          time: '1 month'
        }
      ]
    },
    {
      name: 'Secadora',
      id: 'secadora',
      prices: [
        {
          id: '1',
          title: '1 semana',
          amount: 300,
          time: '1 week'
        },
        {
          id: '2',
          title: '2 semanas',
          amount: 300,
          time: '2 week'
        },
        {
          id: '3',
          title: '1 mes',
          amount: 600,
          time: '1 month'
        },
        {
          id: '4',
          title: '1 mes*',
          amount: 700,
          time: '1 month'
        }
      ]
    }
  ]
}

export default CATEGORIES_ITEMS
