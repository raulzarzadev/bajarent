const orders = [
  {
    id: 1,
    client: {
      id: 1,
      name: 'Juan',
      lastName: 'Perez',
      email: 'juan@mail.com',
      phone: '1234567890',
      address: 'Calle 123',
      city: 'Bogota',
      country: 'Colombia',
      location: 'Calle 123, Bogota, Colombia'
    },
    items: [
      {
        id: 1,
        status: 'in-use',
        startAt: '2021-01-01T00:00:00.000Z',
        price: {
          amount: 100,
          title: 'Normal',
          time: 24 * 60
        }
      },
      {
        id: 2,
        status: 'finished',
        finishedAt: '2021-01-01T00:00:00.000Z',
        startAt: '2021-01-01T00:00:00.000Z',
        price: {
          amount: 200,
          title: 'Normal',
          time: 24 * 60
        }
      }
    ],
    shipping: {
      date: '2021-01-01T00:00:00.000Z',
      location: 'Calle 123, Bogota, Colombia'
    },
    totalOrder: 300,
    payments: [
      {
        id: 1,
        amount: 100,
        date: '2021-01-01T00:00:00.000Z',
        type: 'cash'
      },
      {
        id: 2,
        amount: 200,
        date: '2021-01-01T00:00:00.000Z',
        type: 'cash'
      }
    ]
  },
  {
    id: 2,
    client: {
      id: 2,
      name: 'Maria',
      lastName: 'Lopez',
      email: 'maria@mail.com',
      phone: '0987654321',
      address: 'Calle 456',
      city: 'Medellin',
      country: 'Colombia',
      location: 'Calle 456, Medellin, Colombia'
    },
    items: [
      {
        id: 3,
        status: 'in-use',
        startAt: '2021-02-01T00:00:00.000Z',
        price: {
          amount: 150,
          title: 'Normal',
          time: 24 * 60
        }
      },
      {
        id: 4,
        status: 'finished',
        finishedAt: '2021-02-01T00:00:00.000Z',
        startAt: '2021-02-01T00:00:00.000Z',
        price: {
          amount: 250,
          title: 'Normal',
          time: 24 * 60
        }
      }
    ],
    shipping: {
      date: '2021-02-01T00:00:00.000Z',
      location: 'Calle 456, Medellin, Colombia'
    },
    totalOrder: 400,
    payments: [
      {
        id: 3,
        amount: 150,
        date: '2021-02-01T00:00:00.000Z',
        type: 'cash'
      }
    ]
  }
]

const DATA = {
  orders
}
export default DATA
