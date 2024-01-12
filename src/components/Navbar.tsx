import React from 'react'
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native'

const Navbar: React.FC = () => {
  return (
    <View style={styles.navbar}>
      <Pressable style={styles.navItem}>
        <Text style={styles.navText}>BajaRent</Text>
      </Pressable>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos para rentar"
      />
      <Pressable style={styles.navItem}>
        <Text style={styles.navText}>Perfil</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    height: 60,
    paddingHorizontal: 20
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10
  }
})

export default Navbar
