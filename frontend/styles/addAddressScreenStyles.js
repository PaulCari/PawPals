// frontend/styles/addAddressScreenStyles.js

import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const ORANGE = '#FF8C42';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  container: {
    flex: 1,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },

  // === SECCIÓN DE UBICACIÓN ===
  locationSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    backgroundColor: 'white',
    marginBottom: 2,
  },

  locationButton: {
    backgroundColor: MAIN_PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: MAIN_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  coordsInputContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },

  coordInputGroup: {
    flex: 1,
  },

  coordLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },

  coordInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0F5',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: MAIN_PURPLE,
  },

  helpText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  // === FORMULARIO ===
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
    backgroundColor: 'white',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  required: {
    color: '#FF6B6B',
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  // === CHECKBOX ===
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: MAIN_PURPLE,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: MAIN_PURPLE,
  },

  checkboxLabel: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },

  // === BOTÓN GUARDAR ===
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  saveButton: {
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

  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },

  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});