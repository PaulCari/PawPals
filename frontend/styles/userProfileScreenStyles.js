// frontend/styles/userProfileScreenStyles.js
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

  scrollViewContent: {
    paddingBottom: 150, // Espacio para el tab navigator
  },

  // === SECCIÓN DE INFORMACIÓN DEL USUARIO ===
  userInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 35,
  },

  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  editProfileIconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: YELLOW,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
    marginBottom: 8,
  },

  userInfoText: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
  },

  editProfileButton: {
    backgroundColor: YELLOW,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: YELLOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  editProfileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },

  // === SECCIÓN DE MASCOTAS ===
  petsSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  petsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  petsSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },

  petsCount: {
    backgroundColor: MAIN_PURPLE,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  petsCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  petsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // === TARJETA DE MASCOTA ===
  petCard: {
    width: '48%',
    backgroundColor: LIGHT_BACKGROUND,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  petCardImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },

  petCardImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'white',
  },

  petCardBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: YELLOW,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  petCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  petCardInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },

  petCardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 12,
    paddingTop: 12,
    width: '100%',
    alignItems: 'center',
  },

  petCardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  petCardDetailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },

  // === BOTÓN AGREGAR MASCOTA ===
  addPetCard: {
    width: '48%',
    backgroundColor: LIGHT_BACKGROUND,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    minHeight: 240,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: MAIN_PURPLE,
  },

  addPetCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: SECOND_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: SECOND_PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  addPetText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
    textAlign: 'center',
    lineHeight: 20,
  },

  // === LOADING ===
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

    // === BOTÓN ELIMINAR MASCOTA ===
  deletePetButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 6,
  paddingHorizontal: 8,
  borderRadius: 12,
  marginTop: 10,
  backgroundColor: 'transparent',
},

deletePetText: {
  color: '#B45E6A', // rojo pastel suave
  fontSize: 13,
  fontWeight: '600',
  marginLeft: 4,
},
// === ACCIONES DE LA TARJETA ===
  petCardActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    width: '100%',
    justifyContent: 'space-around',
  },

  editPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F5F0F5',
    flex: 1,
    marginRight: 6,
  },

  editPetText: {
    color: '#875686',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  deletePetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    flex: 1,
    marginLeft: 6,
  },

  deletePetText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  customOrderButton: {
  backgroundColor: ORANGE,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 16,
  borderRadius: 30,
  marginHorizontal: 20,
  marginTop: 25,
  marginBottom: 20,
  shadowColor: ORANGE,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
},

customOrderButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 10,
  textAlign: 'center',
  flex: 1,
},

});