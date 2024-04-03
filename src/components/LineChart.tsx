import React, { useEffect } from 'react'
import { Dimensions, Pressable, Text, View } from 'react-native'
import { LineChart as RNChart } from 'react-native-chart-kit'
import { gStyles } from '../styles'

export type LineChartProps = {
  title: string
  labels: string[]
  datasets: { label: string; data: number[]; color: string }[]
}

const LineChart = ({ title, labels, datasets }: LineChartProps) => {
  const handleHidden = (label: string) => {
    setVisibleData((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }
  useEffect(() => {
    setVisibleData(datasets.map(({ label }) => label))
  }, [datasets])
  const [visibleData, setVisibleData] = React.useState([])
  return (
    <View>
      <Text style={gStyles.h2}>{title}</Text>
      <View
        style={{
          flexDirection: 'row',
          margin: 'auto',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {datasets.map(({ label, color }) => (
          <Pressable
            onPress={() => {
              handleHidden(label)
            }}
            key={label}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: visibleData.includes(label)
                  ? color
                  : 'transparent',
                borderWidth: 1,
                borderColor: visibleData.includes(label)
                  ? 'transparent'
                  : color,
                borderRadius: 10,
                marginRight: 10
              }}
            ></View>
            <Text style={{ marginRight: 4 }}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <RNChart
        data={{
          labels,
          datasets:
            datasets.map(({ data, color, label }) => ({
              data,
              color: () =>
                visibleData.includes(label) ? color : 'transparent',
              withDots: false,
              strokeWidth: 3
            })) || []
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
        formatYLabel={(value) => value.toString()}
        // Personaliza las etiquetas del eje Y
      />
    </View>
  )
}

export default LineChart
