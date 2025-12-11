// src/styles/homeScreenStyles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const LIGHT_BACKGROUND = '#F9F9F9';
const ORANGE = '#FF8C42';

export const styles = StyleSheet.create({
  // === CONTENEDOR PRINCIPAL ===
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },

  // === HEADER MORADO ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: 15,
  },
  logo: {
    width: 160,
    height: 120,
    resizeMode: 'contain',
  },

  // === CONTENEDOR BLANCO ===
  container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  // === TÍTULO DE BIENVENIDA ===
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#732C71',
    marginHorizontal: 25,
    marginBottom: 25,
    lineHeight: 38,
  },

  // === CATEGORÍAS CON LÍNEA INFERIOR ===
  categoryScrollView: {
    marginBottom: 25,
    paddingLeft: 25,
    maxHeight: 50,
  },
  categoryButton: {
    marginRight: 30,
    paddingBottom: 10,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
  },
  activeCategoryText: {
    color: MAIN_PURPLE,
    fontWeight: 'bold',
    fontSize: 17,
  },
  categoryUnderline: {
    height: 4,
    width: '100%',
    backgroundColor: MAIN_PURPLE,
    borderRadius: 2,
    shadowColor: MAIN_PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },

  // === LISTA DE PRODUCTOS ===
  productList: {
    paddingLeft: 25,
    paddingVertical: 0,
    paddingBottom: 30,
  },

  // === MENSAJE VACÍO ===
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    marginHorizontal: 40,
  },

  // === BARRA DE NAVEGACIÓN INFERIOR ===
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: MAIN_PURPLE,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderRadius: 25, 
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeNavButton: {
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  navText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  activeNavText: {
    fontWeight: 'bold',
    color: 'white',
  },

  
});