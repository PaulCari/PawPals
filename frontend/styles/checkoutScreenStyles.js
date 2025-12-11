// frontend/styles/checkoutScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const ORANGE = '#FF8C42';
const LIGHT_BACKGROUND = '#F9F9F9';

export const styles = StyleSheet.create({
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

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  // === CONTAINER ===
  container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // === SECCIONES ===
  section: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  // === RESUMEN DEL PEDIDO ===
  orderSummary: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },

  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  summaryValueGreen: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },

  // === DIRECCIONES ===
  noAddressContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  noAddressText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },

  addAddressButton: {
    backgroundColor: ORANGE,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  addAddressButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  addressList: {
    gap: 12,
  },

  addressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  addressCardSelected: {
    borderColor: MAIN_PURPLE,
    backgroundColor: '#F5F0F5',
  },

  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: MAIN_PURPLE,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: MAIN_PURPLE,
  },

  addressInfo: {
    flex: 1,
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },

  principalBadge: {
    backgroundColor: '#FFD100',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },

  principalBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },

  addressReference: {
    fontSize: 14,
    color: '#666',
  },

  // === PRODUCTOS ===
  productItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: 'cover',
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 13,
    color: '#666',
  },

  productSubtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
    marginLeft: 10,
  },

  // === BOTÓN CONFIRMAR ===
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  confirmButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  confirmButtonDisabled: {
    backgroundColor: '#CCC',
  },

  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // === LOADING ===
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_BACKGROUND,
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
});