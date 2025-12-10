// frontend/styles/productDetailScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const ORANGE = '#FF8C42';
const YELLOW = '#FFD100';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },

  // === HEADER MORADO (igual que HomeScreen) ===
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

  // === CONTENEDOR PRINCIPAL ===
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20, // Espacio después de la imagen
  },

  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 180, // 🔥 AUMENTADO de 140 a 160 para dar más espacio a la imagen
    overflow: 'visible', // 🔥 CAMBIADO de 'hidden' a 'visible' para que la imagen no se corte
  },

  // === IMAGEN FLOTANTE ===
  imageContainer: {
    position: 'absolute',
    top: -18, // 🔥 AJUSTADO de -70 a -90 para que sobresalga más
    alignSelf: 'center',
    zIndex: 100, // 🔥 AUMENTADO de 10 a 100 para que esté sobre TODO
  },
  productImage: {
    width: 240,
    height: 250,
    borderRadius: 120,
    borderWidth: 0,
    borderColor: 'white',
    resizeMode: 'cover',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.50,
    shadowRadius: 10,
    elevation: 15,
  },

  // === BOTONES FLOTANTES ===
  backButton: {
    position: 'absolute',
    top: 10, // Ajustado
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: MAIN_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10, // Ajustado
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },

  // === CONTENIDO ===
  contentContainer: {
    paddingHorizontal: 25, // Reducido de 30
    paddingBottom: 40,
    paddingTop: 20, // Aumentado para la barra de navegación
  },

  // === TÍTULO Y PRECIO ===
  productName: {
    fontSize: 28, // Reducido de 32
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8, // Reducido
    paddingHorizontal: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Reducido
  },
  productPrice: {
    fontSize: 26, // Reducido de 28
    fontWeight: 'bold',
    color: MAIN_PURPLE,
    marginHorizontal: 10,
  },

  // === ETIQUETAS ===
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20, // Reducido
    paddingHorizontal: 10,
  },
  tag: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: MAIN_PURPLE,
    borderRadius: 20,
    paddingVertical: 4, // Reducido
    paddingHorizontal: 14, // Reducido
    marginHorizontal: 4,
    marginVertical: 0.5,
  },
  tagText: {
    color: MAIN_PURPLE,
    fontWeight: '600',
    fontSize: 13, // Reducido
  },

  // === SECCIÓN DE INGREDIENTES ===
  section: {
    marginBottom: 7, // Reducido
  },
  sectionTitle: {
    fontSize: 20, // Reducido de 22
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8, // Reducido
  },
  sectionText: {
    fontSize: 15, // Reducido
    color: '#666',
    lineHeight: 22, // Reducido
  },

  // === CONTADOR DE CANTIDAD ===
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15, // Reducido
  },
  quantityButton: {
    width: 35, // Igual que antes
    height: 35,
    borderRadius: 25,
    backgroundColor: MAIN_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  quantityText: {
    fontSize: 22, // Reducido de 24
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 25, // Reducido
    minWidth: 40,
    textAlign: 'center',
  },

  // === BOTÓN AGREGAR AL CARRITO ===
  addToCartButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, // Reducido
    borderRadius: 30,
    marginHorizontal: 15, // Reducido
    marginBottom: 25, // Reducido
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 17, // Reducido
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // === BARRA DE NAVEGACIÓN INFERIOR (igual que HomeScreen) ===
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: MAIN_PURPLE,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
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

  // === LOADING ===
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },

  // === ERROR ===
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: MAIN_PURPLE,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});