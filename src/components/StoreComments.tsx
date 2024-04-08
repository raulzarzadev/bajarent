import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ServiceComments } from '../firebase/ServiceComments'
import { useStore } from '../contexts/storeContext'

import ListComments from './ListComments'
import { gStyles } from '../styles'

const StoreComments = () => {
  const { storeId } = useStore()
  const [lastReports, setLastReports] = useState([])
  const [lastComments, setLastComments] = useState([])
  useEffect(() => {
    if (storeId) {
      ServiceComments.listenLastComments({ storeId, count: 5 }, (comments) => {
        setLastComments(comments)
      })
      ServiceComments.listenLastReports(
        { storeId, count: 5, solved: false },
        (reports) => {
          setLastReports(reports)
        }
      )
    }
  }, [])
  return (
    <View style={{ width: '100%' }}>
      <Text style={gStyles.h3}>Últimos reportes</Text>
      <ListComments comments={lastReports} viewOrder />
      <Text style={gStyles.h3}>Últimos comentarios</Text>
      <ListComments comments={lastComments} viewOrder />
    </View>
  )
}

export default StoreComments
