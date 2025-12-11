// frontend/styles/paymentScreenStyles.js (VERSIÓN COMPLETA)

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
    paddingBottom: 120,
  },

  // === SECCIONES ===
  section: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  // === RESUMEN DEL PAGO ===
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
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
  },

  summaryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },

  // === MÉTODOS DE PAGO ===
  methodsContainer: {
    flexDirection: 'row',
    gap: 15,
  },

  methodCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  methodCardSelected: {
    borderColor: MAIN_PURPLE,
    backgroundColor: '#F5F0F5',
  },

  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: MAIN_PURPLE,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: MAIN_PURPLE,
  },

  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },

  methodNameSelected: {
    color: MAIN_PURPLE,
    fontWeight: 'bold',
  },

  // === CÓDIGO QR ===
  qrCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  qrImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 15,
  },

  // ✅ NUEVO: Placeholder para QR con ícono
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  qrInstructions: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    textAlign: 'left',
    width: '100%',
  },

  // === SUBIR COMPROBANTE ===
  uploadButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MAIN_PURPLE,
    marginTop: 15,
  },

  uploadSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },

  proofContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  proofImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    resizeMode: 'contain',
    marginBottom: 15,
  },

  changeProofButton: {
    flexDirection: 'row',
    backgroundColor: MAIN_PURPLE,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },

  changeProofText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // === INFO BOX ===
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F0F5',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: MAIN_PURPLE,
  },

  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
});