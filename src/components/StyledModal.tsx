import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native'
import React, { ReactNode } from 'react'
import Icon from './Icon'

const windowHeight = Dimensions.get('window').height

export type StyledModalProps = {
  open?: boolean
  setOpen?: (open: boolean) => void
  children?: ReactNode
  title?: string
  size?: 'md' | 'full'
}
const StyledModal = ({
  open,
  setOpen,
  children,
  title = '',
  size = 'md'
}: StyledModalProps) => {
  return (
    <View>
      <View style={styles.centeredView}>
        <Modal
          role="dialog"
          animationType="slide"
          transparent={true}
          visible={open}
          onRequestClose={() => {
            // alert('Modal has been closed.')
            setOpen(!open)
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                size === 'full' && styles.fullSizeModal,
                size === 'md' && styles.mdSizeModal
              ]}
            >
              <View style={styles.topBar}>
                <Text style={styles.title}>{title}</Text>
                <Pressable onPress={() => setOpen(!open)}>
                  <Icon icon="close" />
                </Pressable>
              </View>
              <ScrollView style={{ width: '100%' }}>{children}</ScrollView>
            </View>
          </View>
        </Modal>
      </View>
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
    backgroundColor: 'white',
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
  mdSizeModal: {
    margin: 20,
    maxWidth: 500,
    maxHeight: windowHeight,
    width: '90%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12
  },
  fullSizeModal: {
    margin: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    height: windowHeight,
    width: '100%',
    maxWidth: 'auto',
    paddingTop: 28
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})
