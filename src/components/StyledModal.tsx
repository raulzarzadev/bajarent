import type { ReactNode } from 'react'
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  useWindowDimensions
} from 'react-native'
import Icon from './Icon'
import { pad } from 'cypress/types/lodash'

export type StyledModalProps = {
  open?: boolean
  setOpen?: (open: boolean) => void
  children?: ReactNode
  title?: string
  size?: 'md' | 'full'
  onclose?: () => void
}
const StyledModal = ({
  open,
  setOpen,
  children,
  title = '',
  size = 'md',
  onclose = () => {}
}: StyledModalProps) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions()

  const handleClose = () => {
    setOpen(!open)
    onclose()
  }

  // Define max widths based on size prop
  const maxWidths = {
    md: 500,
    full: windowWidth * 0.95
  }

  const maxWidth = maxWidths[size] || maxWidths.md
  const isSmallView = windowWidth < 600

  const modalStyles = {
    margin: isSmallView ? 10 : 20,
    paddingVertical: isSmallView ? 5 : 20,
    paddingHorizontal: isSmallView ? 8 : 24,
    paddingTop: isSmallView ? 12 : 12,
    paddingBottom: isSmallView ? 10 : 20,
    maxHeight: windowHeight - (isSmallView ? 20 : 40),
    width: Math.min(windowWidth - (isSmallView ? 0 : 40), maxWidth),
    borderRadius: 20
  }

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
          <Pressable onPress={handleClose} style={{ flex: 1 }}>
            <View
              style={[
                styles.centeredView,
                open ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}
              ]}
            >
              <Pressable onPress={(e) => e.stopPropagation()}>
                <View style={[styles.modalView, modalStyles]}>
                  <View style={styles.topBar}>
                    <Text style={styles.title}>{title}</Text>
                    <Pressable onPress={() => handleClose()}>
                      <Icon icon="close" />
                    </Pressable>
                  </View>
                  <ScrollView
                    style={{ width: '100%', flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                  >
                    {children}
                  </ScrollView>
                </View>
              </Pressable>
            </View>
          </Pressable>
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
    alignItems: 'center'
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
    elevation: 5,
    borderRadius: 20
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
    marginTop: 12
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})
