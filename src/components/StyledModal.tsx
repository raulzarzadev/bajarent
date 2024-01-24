import { Pressable, StyleSheet, Text, View, Modal } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons' // Asegúrate de instalar @expo/vector-icons

const StyledModal = ({ open, setOpen, children, title }) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          alert('Modal has been closed.')
          setOpen(!open)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.topBar}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={() => setOpen(!open)}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
            </View>
            {children}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default StyledModal
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    //marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})
