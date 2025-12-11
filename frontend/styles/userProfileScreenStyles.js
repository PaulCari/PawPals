// frontend/styles/userProfileScreenStyles.js
import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const YELLOW = '#FFD100';
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
    width: 120,
    height: 60,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: 40,
  },

  // --- Profile Header ---
  profileHeader: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: SECOND_PURPLE,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10,
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SECOND_PURPLE,
  },
  profileContact: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: YELLOW,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: SECOND_PURPLE,
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: 15,
  },
  petCard: {
    backgroundColor: LIGHT_BACKGROUND,
    borderRadius: 15,
    padding: 15,
    width: '48%', // Aprox para 2 por fila
    alignItems: 'center',
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  petInfo: {
    fontSize: 13,
    color: '#777',
  },
  petDetails: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
    textAlign: 'center',
  },
  addPetCard: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#DDD',
    paddingVertical: 30, // Ajusta para que tenga altura similar
  },
  addPetCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: SECOND_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addPetText: {
    fontSize: 14,
    fontWeight: '600',
    color: SECOND_PURPLE,
    textAlign: 'center'
  },
});