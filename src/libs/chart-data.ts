import OrderType from '../types/OrderType'
import asDate from './utils-date'

type ChartData = {
  labels: string[]
  datasets: { label: string; data: number[]; color: string }[]
}

function formatOrderTypeDate(date: Date): string {
  // Función para formatear la fecha de OrderType a un formato de mes/año
  return `${asDate(date).getMonth() + 1}/${asDate(date).getFullYear()}`
}

export function generateChartData(orders: OrderType[]): ChartData {
  const ordersByMonthYear: { [key: string]: number } = {}

  // Contar la cantidad de órdenes para cada mes/año
  orders.forEach((order) => {
    const monthYear = formatOrderTypeDate(new Date(order.createdAt))
    ordersByMonthYear[monthYear] = (ordersByMonthYear[monthYear] || 0) + 1
  })

  // Construir los arrays de labels y data para el gráfico
  const labels = Object.keys(ordersByMonthYear).sort()
  const data = labels.map((label) => ordersByMonthYear[label])

  // Construir el objeto final
  const chartData: ChartData = {
    labels,
    datasets: [{ label: 'Órdenes creadas', data, color: 'blue' }]
  }

  return chartData
}

// // Uso:
// // orders es un array de OrderType
// const orders: OrderType[] = [...]; // Tu array de OrderType

// const chartData = generateChartData(orders);
// console.log(chartData);
