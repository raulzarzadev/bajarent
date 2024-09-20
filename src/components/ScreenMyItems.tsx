import { ScrollView } from 'react-native'
import React from 'react'
import { useEmployee } from '../contexts/employeeContext'
import { ListMyItemsE } from './ListMyItems'
import withDisabledCheck from './HOCs/withDisabledEmployeeCheck'

const ScreenMyItems = () => {
  const { items } = useEmployee()
  return (
    <ScrollView>
      <ListMyItemsE items={items} />
    </ScrollView>
  )
}

export default withDisabledCheck(ScreenMyItems)
