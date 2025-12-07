import React, { type ReactNode } from 'react'
import {
	Dimensions,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View
} from 'react-native'
import Icon from './Icon'

const { height: windowHeight, width: windowWidth } = Dimensions.get('window')

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
	const handleClose = () => {
		setOpen(!open)
		onclose()
	}
	const isSmallView = windowWidth < 600
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
					<TouchableWithoutFeedback onPress={handleClose}>
						<View style={[styles.centeredView, open ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}]}>
							<TouchableWithoutFeedback>
								<View
									style={[
										styles.modalView,
										isSmallView ? styles.fullSizeModal : styles.mdSizeModal
										// size === 'full' && styles.fullSizeModal,
										// size === 'md' && styles.mdSizeModal
									]}
								>
									<>
										<View style={styles.topBar}>
											<Text style={styles.title}>{title}</Text>
											<Pressable onPress={() => handleClose()}>
												<Icon icon="close" />
											</Pressable>
										</View>
										<ScrollView style={{ width: '100%' }}>{children}</ScrollView>
									</>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableWithoutFeedback>
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
		marginBottom: 12,
		marginTop: 12
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	}
})
