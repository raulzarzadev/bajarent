import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons' // Asegúrate de instalar @expo/vector-icons
import Icon from './Icon'
const windowHeight = Dimensions.get('window').height

const StyledModal = ({ open, setOpen, children, title }) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          // alert('Modal has been closed.')
          setOpen(!open)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.topBar}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={() => setOpen(!open)}>
                <Icon icon="close" />
                {/* <Ionicons name="close" size={24} color="black" /> */}
              </Pressable>
            </View>
            <ScrollView style={{ width: '100%' }}>{children}</ScrollView>
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
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
    // marginTop: 22
  },
  modalView: {
    maxWidth: 500,
    maxHeight: windowHeight,
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
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
