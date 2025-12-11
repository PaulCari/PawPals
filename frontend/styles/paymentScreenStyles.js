// frontend/styles/paymentScreenStyles.js
import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const ORANGE = '#FF8C42';
const LIGHT_GRAY = '#F5F5F5';
const DARK_TEXT = '#333';
const INFO_BG = '#FFF3E0';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },

  safeArea: {
    flex: 1,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },

  logo: {
    width: 160,
    height: 120,
    resizeMode: 'contain',
  },

  // 🔥 CAMBIO CRÍTICO #1: Container con flex
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  // 🔥 CAMBIO CRÍTICO #2: ScrollView sin flex
  scrollContainer: {
    flex: 1,
  },

  // 🔥 CAMBIO CRÍTICO #3: Padding aumentado
  scrollContent: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 250, // ⬆️ AUMENTADO de 200 a 250
  },

  paymentTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#732C71',
    marginHorizontal: 25,
    marginBottom: 20,
    lineHeight: 36,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT,
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_TEXT,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },

  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  methodCardSelected: {
    borderWidth: 2,
    borderColor: MAIN_PURPLE,
    backgroundColor: '#F9F5F9',
  },

  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MAIN_PURPLE,
  },

  methodName: {
    marginLeft: 8,
    fontSize: 16,
    color: DARK_TEXT,
  },

  methodNameSelected: {
    fontWeight: 'bold',
    color: MAIN_PURPLE,
  },

  qrCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  qrImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: 'contain',
    marginTop: -20,
  },

  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    lineHeight: 22,
    alignSelf: 'stretch',
    marginTop: -45,
  },

  uploadButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: MAIN_PURPLE,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_TEXT,
    marginTop: 10,
  },

  uploadSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },

  proofContainer: {
    alignItems: 'center',
  },

  proofImage: {
    width: 220,
    height: 220,
    borderRadius: 15,
    marginBottom: 15,
    resizeMode: 'cover',
  },

  changeProofButton: {
    flexDirection: 'row',
    backgroundColor: MAIN_PURPLE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },

  changeProofText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: INFO_BG,
    padding: 15,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginBottom: 30,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 13,
    color: DARK_TEXT,
    flex: 1,
    lineHeight: 19,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 15,
    backgroundColor: LIGHT_GRAY,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  confirmButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  confirmButtonDisabled: {
    opacity: 0.6,
  },

  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  qrCard: {
  backgroundColor: 'white',
  borderRadius: 15,
  padding: 12,
  flexDirection: 'row',      // ⬅️ Aquí hacemos fila
  alignItems: 'center',      // Centra verticalmente
  justifyContent: 'flex-start',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
},

qrImage: {
  width: 144,                // ⬅️ Ajusta según quieras
  height: 144,
  resizeMode: 'contain',
  marginRight: 10,           // ⬅️ Espacio entre imagen y texto
  marginTop: 0,              // ⬅️ quitar margenes negativos
},

qrInstructions: {
  fontSize: 14,
  color: '#666',
  textAlign: 'left',
  lineHeight: 22,
  flex: 1,                   // ⬅️ Que tome el resto del espacio
  marginTop: 0,
},

});