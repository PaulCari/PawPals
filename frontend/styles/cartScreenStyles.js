// frontend/styles/cartScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const ORANGE = '#FF8C42';
const LIGHT_BACKGROUND = '#F9F9F9';
const SOFT_RED = '#FF6B6B';

export const styles = StyleSheet.create({
  // === CONTENEDOR PRINCIPAL ===
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },

  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },

  // === HEADER ===
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
  },

  // === TÍTULO ===
  titleContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: SECOND_PURPLE,
    letterSpacing: 0.3,
    marginBottom: 10,
  },

  countText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8A8A8A',
    marginLeft: 5,
  },

  // === LISTA ===
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 200,
  },

  // === ITEMS DEL CARRITO ===
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    resizeMode: 'cover',
  },

  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: MAIN_PURPLE,
  },

  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
  },

  // === CONTROL DE CANTIDAD ===
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MAIN_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },

  itemSubtotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
    marginVertical: 5,
  },

  removeButton: {
    padding: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 15,
  },

  // === RESUMEN DEL PEDIDO ===
  summaryContainer: {
  backgroundColor: 'white',
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  padding: 25,
  paddingBottom: 120, //  Espacio para la barra de navegación (90px) + margen
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 10,
},
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },

  checkoutButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  checkoutButtonDisabled: {
    backgroundColor: '#CCC',
  },

  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // === ESTADOS DE CARGA Y VACÍO ===
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },

  exploreButton: {
    backgroundColor: ORANGE,
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});