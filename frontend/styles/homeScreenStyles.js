// src/styles/homeScreenStyles.js
import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const LIGHT_BACKGROUND = '#F9F9F9';

export const styles = StyleSheet.create({
  // === CONTENEDORES PRINCIPALES ===
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },

  container: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
    overflow: 'hidden',
  },

  // === FONDO DECORATIVO ===
  ellipseImage: {
    position: 'absolute',
    top: -100,
    left: -150,
    width: 350,
    height: 350,
    resizeMode: 'contain',
    opacity: 0.1,
  },
  pawImage: {
    position: 'absolute',
    top: 30,
    left: 10,
    width: 80,
    height: 100,
    opacity: 0.5,
    resizeMode: 'contain',
    transform: [{ rotate: '-25deg' }],
  },
  boneImage: {
    position: 'absolute',
    top: 49,
    right: 80,
    width: 60,
    height: 60,
    opacity: 0.5,
    resizeMode: 'contain',
    transform: [{ rotate: '20deg' }],
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 10,
    zIndex: 10,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },

  // === SECCIÓN DE CONTENIDO ===
  bodyContainer: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1c',
    marginHorizontal: 25,
    marginBottom: 25,
  },

  // === CATEGORÍAS ===
  categoryScrollView: {
    marginBottom: 25,
    paddingLeft: 25,
  },
  categoryButton: {
    marginRight: 30,
    paddingBottom: 6,
  },
  activeCategoryButton: {
    borderBottomWidth: 3,
    borderBottomColor: MAIN_PURPLE,
  },
  categoryText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: MAIN_PURPLE,
    fontWeight: 'bold',
  },

  // === LISTA DE PRODUCTOS ===
  listContainer: {
    backgroundColor: LIGHT_BACKGROUND,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  productList: {
    paddingLeft: 25,
    paddingVertical: 10,
  },

  // === ESTADOS DE VACÍO Y CARGA ===
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_BACKGROUND,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});


