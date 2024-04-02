import { expect, test } from 'bun:test'

test('create data for chart', () => {
  test('should return an object with labels and datasets', () => {
    const result = {
      labels: ['1/2021', '2/2021', '3/2021'],
      datasets: [{ label: 'Órdenes creadas', data: [2, 3, 1], color: 'blue' }]
    }
    expect(result)({
      labels: ['1/2021', '2/2021', '3/2021'],
      datasets: [{ label: 'Órdenes creadas', data: [2, 3, 1], color: 'blue' }]
    })
  })
})
