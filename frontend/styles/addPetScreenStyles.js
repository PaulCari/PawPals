// frontend/styles/addPetScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const ORANGE = '#FF8C42';
const YELLOW = '#FFD100';
const LIGHT_BACKGROUND = '#F9F9F9';
const DISABLED_GREY = '#cccccc';

export const styles = StyleSheet.create({
  // === CONTENEDOR PRINCIPAL ===
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE, // 🔥 Fondo morado como el perfil
  },

  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
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

  // === CONTENEDOR BLANCO REDONDEADO ===
  formWrapper: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
  },

  // === SCROLL CONTENT ===
  formContainer: {
    paddingHorizontal: 25,
    paddingBottom: 150, // Espacio para el tab navigator
  },

  // === TÍTULO ===
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: SECOND_PURPLE,
    marginBottom: 25,
    letterSpacing: 0.3,
  },

  // === SECCIÓN DE INFORMACIÓN (OPCIONAL) ===
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    marginRight: 12,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // === INPUTS ===
  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  // === PICKERS (SELECTORES) ===
  pickerContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  pickerLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    marginTop: 4,
  },

  picker: {
    width: '100%',
    height: 40,
    color: '#333',
  },

  // === BOTÓN GUARDAR ===
  saveButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  saveButtonDisabled: {
    backgroundColor: DISABLED_GREY,
    shadowColor: DISABLED_GREY,
  },

  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  photoSection: {
  alignItems: 'center',
  marginBottom: 25,
},

photoContainer: {
  position: 'relative',
  width: 140,
  height: 140,
  borderRadius: 70,
  overflow: 'hidden',
  borderWidth: 4,
  borderColor: 'white',
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8,
},

petPhoto: {
  width: '100%',
  height: '100%',
},

photoPlaceholder: {
  width: '100%',
  height: '100%',
  backgroundColor: '#F5F0F5',
  justifyContent: 'center',
  alignItems: 'center',
},

photoEditBadge: {
  position: 'absolute',
  bottom: 5,
  right: 5,
  backgroundColor: '#FF8C42',
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: 'white',
},

photoHint: {
  marginTop: 12,
  fontSize: 14,
  color: '#888',
  fontStyle: 'italic',
},

textArea: {
  height: 100,
  textAlignVertical: 'top',
  paddingTop: 12,
},
});