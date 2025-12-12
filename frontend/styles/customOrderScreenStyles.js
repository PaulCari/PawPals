// frontend/styles/customOrderScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const ORANGE = '#FF8C42';
const YELLOW = '#FFD100';
const LIGHT_BACKGROUND = '#F9F9F9';

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

  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: SECOND_PURPLE,
    marginBottom: 25,
    letterSpacing: 0.3,
  },

  // === SECCIONES ===
  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  // === LISTA DE MASCOTAS ===
  petsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  petCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  petCardSelected: {
    borderColor: MAIN_PURPLE,
    backgroundColor: '#F5F0F5',
  },

  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10,
  },

  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  petInfo: {
    fontSize: 13,
    color: '#888',
  },

  // === MASCOTA SELECCIONADA ===
  selectedPetBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  selectedPetImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: MAIN_PURPLE,
  },

  selectedPetInfo: {
    flex: 1,
    marginLeft: 15,
  },

  selectedPetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
    marginBottom: 4,
  },

  selectedPetDetails: {
    fontSize: 14,
    color: '#666',
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

  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  // === CHECKBOX ===
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
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

  // === ARCHIVOS ===
  fileSection: {
    marginBottom: 20,
  },

  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: MAIN_PURPLE,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  fileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: MAIN_PURPLE,
    marginLeft: 10,
  },

  fileName: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // === BOTÓN ENVIAR ===
  submitButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },

  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // === ESTADO VACÍO ===
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },

  addPetButton: {
    backgroundColor: ORANGE,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  addPetButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // === LOADING ===
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
});