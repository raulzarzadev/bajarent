import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { gStyles } from '../styles'
import Icon from './Icon'
import { ExpandibleListE } from './BusinessStatus'
import { ModalFilterListE } from './ModalFilterList'
import { useStore } from '../contexts/storeContext'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import asDate, { dateFormat } from '../libs/utils-date'
import { useEmployee } from '../contexts/employeeContext'

const StoreWorkshop = () => {
  const { storeId, staff } = useStore()
  const [repairs, setRepairs] = useState<RepairType[]>([])
  const [movements, setMovements] = useState<MovementType[]>([])
  const { items } = useEmployee()
  useEffect(() => {
    if (storeId) {
      ServiceItemHistory.getItemsMovements({
        date: new Date(),
        storeId,
        type: 'fix'
      }).then((repairs) => {
        setRepairs(
          repairs.map((repair) => ({
            id: repair.id,
            authorName: staff.find(({ userId }) => userId === repair.createdBy)
              ?.name,
            itemNumber: items.find(({ id }) => id === repair.itemId)?.number,
            description: repair.content,
            time: dateFormat(asDate(repair.createdAt), 'HH:mm'),
            itemSerial: repair.itemId
          }))
        )
      })
      ServiceItemHistory.getItemsMovements({
        date: new Date(),
        storeId,
        type: 'assignment'
      }).then((movements) => {
        setMovements(
          movements.map((movement) => ({
            id: movement.id,
            authorName: staff.find(
              ({ userId }) => userId === movement.createdBy
            )?.name,
            itemNumber: items.find(({ id }) => id === movement.itemId)?.number,
            fromSection: movement.content, //movement.fromSection,
            toSection: '', // movement.toSection,
            time: dateFormat(asDate(movement.createdAt), 'HH:mm'),
            itemSerial: movement.itemId
          }))
        )
      })
    }
  }, [storeId])

  useEffect(() => {
    setData([...repairs, ...movements])
  }, [movements, repairs])

  const [data, setData] = React.useState<(RepairType | MovementType)[]>()
  const [filteredData, setFilteredData] =
    React.useState<(RepairType | MovementType)[]>()

  return (
    <View style={{ marginTop: 8, paddingHorizontal: 12 }}>
      <View style={{ maxWidth: 400, margin: 'auto' }}>
        <ModalFilterListE
          data={data}
          setData={(data) => {
            setFilteredData(data)
          }}
          filters={[
            {
              field: 'itemNumber',
              label: 'Número de artículo'
            }
          ]}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <ExpandibleListE
          label="Reparaciones"
          onPressRow={() => {}}
          items={repairs.filter(
            ({ id }) => !!filteredData.find((data) => data.id === id)
          )}
          renderItem={(repair) => <Repair repair={repair} />}
        />
        <ExpandibleListE
          label="Movimientos"
          onPressRow={() => {}}
          items={movements.filter(
            ({ id }) => !!filteredData.find((data) => data.id === id)
          )}
          renderItem={(movement) => <Movement movement={movement} />}
        />
      </View>
    </View>
  )
}

export type RepairType = {
  id: string
  itemNumber: string
  description: string
  time: string
  authorName: string
  itemSerial: string
}

const Repair = ({ repair }: { repair: RepairType }) => {
  return (
    <View style={{ marginVertical: 6, padding: 4 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[gStyles.tBold, { marginRight: 4 }]}>
          {repair.itemNumber}
        </Text>
        <Text style={[]}>{repair.description}</Text>
      </View>
      <Text style={[gStyles.helper]}>
        {repair.time} {repair.authorName}
      </Text>
    </View>
  )
}
export type MovementType = {
  id: string
  authorName: string
  time: string
  itemNumber: string
  fromSection: string
  toSection: string
  itemSerial: string
}

const Movement = ({ movement }: { movement: MovementType }) => {
  return (
    <View style={{ marginVertical: 4, padding: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={[gStyles.tBold, { marginRight: 4 }]}>
          {movement.itemNumber}
        </Text>
        <Text>{movement.fromSection}</Text>
        <Icon icon="rowRight" size={14} />
        <Text>{movement.toSection}</Text>
      </View>
      <Text style={gStyles.helper}>
        {movement.time} {movement.authorName}
      </Text>
    </View>
  )
}

export default StoreWorkshop

const styles = StyleSheet.create({})

const repairsTest: RepairType[] = [
  {
    id: '3',
    itemNumber: '237',
    description: 'Cambio de frenos',
    time: '13:45',
    authorName: 'Maria Lopez',
    itemSerial: 'ABC123'
  },
  {
    id: '4',
    itemNumber: '238',
    description: 'Reparación de motor',
    time: '14:30',
    authorName: 'Juan Perez',
    itemSerial: 'DEF456'
  },
  {
    id: '5',
    itemNumber: '239',
    description: 'Cambio de llantas',
    time: '15:15',
    authorName: 'Ana Ramirez',
    itemSerial: 'GHI789'
  }
]

const movementsTest: MovementType[] = [
  {
    id: '132523',
    authorName: 'Maria Lopez',
    time: '13:45',
    itemNumber: '237',
    fromSection: 'Almacén',
    toSection: 'Taller',
    itemSerial: 'ABC123'
  },
  {
    id: '2634',
    authorName: 'Juan Perez',
    time: '14:30',
    itemNumber: '238',
    fromSection: 'Taller',
    toSection: 'Almacén',
    itemSerial: 'DEF456'
  },
  {
    id: '343',
    authorName: 'Ana Ramirez',
    time: '15:15',
    itemNumber: '239',
    fromSection: 'Almacén',
    toSection: 'Taller',
    itemSerial: 'GHI789'
  }
]
