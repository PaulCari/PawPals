// frontend/styles/userProfileScreenStyles.js
import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const YELLOW = '#FFD100';
const LIGHT_BACKGROUND = '#F9F9F9';
const GREY_TEXT = '#888';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
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
  container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  scrollViewContent: {
    paddingBottom: 120, // Espacio para el tab navigator
  },
  
  // --- Profile Header ---
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: SECOND_PURPLE,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // --- User Info Section ---
  userInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 15,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },
  userInfoText: {
    fontSize: 16,
    color: GREY_TEXT,
    marginTop: 5,
  },
  editProfileButton: {
    backgroundColor: YELLOW,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 15,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },
  
  // --- Mascotas Section ---
  petsSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  petsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  petsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // --- Pet Card ---
  petCard: {
    width: '48%',
    backgroundColor: LIGHT_BACKGROUND,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  petCardImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  petCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  petCardInfo: {
    fontSize: 14,
    color: GREY_TEXT,
    marginTop: 4,
  },
  petCardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    marginTop: 10,
    paddingTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  petCardDetailText: {
    fontSize: 13,
    color: GREY_TEXT,
  },
  
  // --- Add Pet Card ---
  addPetCard: {
    width: '48%',
    backgroundColor: LIGHT_BACKGROUND,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    height: 250, // Misma altura que la tarjeta de mascota
  },
  addPetCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: SECOND_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addPetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
    textAlign: 'center',
  },

  // --- Loading ---
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});