import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ServiceComments } from '../firebase/ServiceComments'
import { useStore } from '../contexts/storeContext'

import ListComments, { CommentRow } from './ListComments'
import { gStyles } from '../styles'
import List from './List'

const StoreComments = () => {
  const { storeId, comments } = useStore()
  const [lastReports, setLastReports] = useState([])
  const [lastComments, setLastComments] = useState([])
  const commentsNotSolved = comments?.filter((c) => !c.solved)

  useEffect(() => {
    // if (storeId) {
    //   ServiceComments.listenLastComments({ storeId, count: 5 }, (comments) => {
    //     setLastComments(comments)
    //   })
    //   ServiceComments.listenLastReports(
    //     { storeId, count: 5, solved: true },
    //     (reports) => {
    //       setLastReports(reports)
    //     }
    //   )
    // }
  }, [])
  console.log({ comment: comments[0] })

  return (
    <View style={{ width: '100%' }}>
      <List
        ComponentRow={(props) => (
          <CommentRow comment={props.item} viewOrder key={props.item.id} />
        )}
        data={comments}
        filters={[
          { field: 'solved', label: 'Resuelto', boolean: true },
          { field: 'createdBy', label: 'Creado por' },
          { field: 'type', label: 'Tipo' }
        ]}
      />
      {/* <Text style={gStyles.h3}>Reportes no resueltos</Text>
      <ListComments comments={commentsNotSolved} viewOrder />
      <Text style={gStyles.h3}>Últimos reportes</Text>
      <ListComments comments={lastReports} viewOrder />
      <Text style={gStyles.h3}>Últimos comentarios</Text>
      <ListComments comments={lastComments} viewOrder /> */}
    </View>
  )
}

export default StoreComments
