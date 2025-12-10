// Archivo: src/styles/productDetailScreenStyles.js
import { StyleSheet, Platform, Dimensions } from 'react-native';

const MAIN_PURPLE = '#875686';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  
  // --- FONDO Y HEADER ---
  backgroundHeader: {
    backgroundColor: MAIN_PURPLE,
    height: 260, 
    position: 'relative',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden', 
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: Platform.OS === 'android' ? 40 : 60,
    opacity: 0.8,
    letterSpacing: 2,
  },
  ellipseImage: {
    position: 'absolute',
    top: -50,
    left: -80,
    width: 300,
    height: 300,
    resizeMode: 'contain',
    opacity: 0.2,
  },
  yellowShape: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    resizeMode: 'contain',
    opacity: 0.3,
  },

  // --- CONTENIDO FLOTANTE ---
  contentContainer: {
    paddingHorizontal: 25,
    marginTop: -140,
    paddingBottom: 20,
  },
  
  // --- BOTONES FLOTANTES ---
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  favoriteButton: {
    position: 'absolute',
    top: -180, // Ajustado relativo al contentContainer
    right: 0,
    zIndex: 30,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 25,
    elevation: 5,
  },

  // --- IMAGEN DEL PRODUCTO ---
  productImage: {
    width: 250,  
    height: 250,
    borderRadius: 125, 
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 8,
    borderColor: '#F2F2F2',
    backgroundColor: '#fff', 
  },

  // --- INFORMACIÓN ---
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MAIN_PURPLE,
    marginBottom: 20,
  },
  
  // --- DESCRIPCIÓN ---
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 20,
    alignSelf: 'stretch',
  },

  // --- TAGS ---
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  tag: {
    borderColor: MAIN_PURPLE,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: 'rgba(135, 86, 134, 0.05)',
  },
  tagText: {
    color: MAIN_PURPLE,
    fontWeight: '600',
    fontSize: 14,
  },

  // --- FOOTER ---
  footer: {
    padding: 25,
    paddingBottom: 40,
    backgroundColor: '#F2F2F2',
  },
  addToCartButton: {
    backgroundColor: MAIN_PURPLE,
    borderRadius: 30,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addToCartButtonText: {
    color: '#FFD100',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});