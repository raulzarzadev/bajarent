import React from 'react'
import { Dimensions, Text, View } from 'react-native'
import { LineChart as RNChart } from 'react-native-chart-kit'

export type ChartData = { labels: string[]; datasets: { data: number[] }[] }

export type LineChartProps = {
  title: string
  labels: string[]
  datasets: { label: string; data: number[]; color: string }[]
}

const LineChart = ({ title, labels, datasets }: LineChartProps) => {
  return (
    <View>
      <Text>{title}</Text>
      <RNChart
        data={{
          labels,
          datasets: datasets.map(({ data, color }) => ({
            data,
            color: () => color,
            withDots: false,
            strokeWidth: 1
          }))
        }}
        width={Dimensions.get('window').width}
        height={220}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#000'
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
        fromZero={true} // Para asegurar que el eje Y comience desde cero
        formatYLabel={(value) => value.toString()} // Personaliza las etiquetas del eje Y
      />
    </View>
  )
}

export default LineChart
