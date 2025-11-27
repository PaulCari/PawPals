// Archivo: styles/productDetailScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color de fondo del contenedor principal
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  // --- FONDO Y HEADER ---
  backgroundHeader: {
    backgroundColor: MAIN_PURPLE,
    height: 225, // Altura del fondo morado
    position: 'relative', // Para posicionar las formas
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: Platform.OS === 'android' ? 20 : 50,
    opacity: 0.6,
  },
  ellipseImage: {
    position: 'absolute',
    top: -50,
    left: -120,
    width: 300,
    height: 300,
    resizeMode: 'contain',
    opacity: 0.5,
  },
  yellowShape: {
    position: 'absolute',
    bottom: -100, // Posiciona la forma amarilla
    right: -100,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  // --- CONTENIDO ---
  contentContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 25,
    marginTop: -160, // Sube el contenido para que se superponga
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 25,
    backgroundColor: MAIN_PURPLE,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 35,
    color: MAIN_PURPLE,
    zIndex: 20,
  },
  // --- IMAGEN (CLAVE DEL DISEÑO) ---
  productImage: {
    width: 100,
    height: 250,
    borderRadius: 125,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 8,
    borderColor: '#F2F2F2', // Borde del mismo color que el fondo
  },
  // --- INFORMACIÓN DEL PRODUCTO ---
  productInfo: {
    alignItems: 'center', // Centra el texto
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '600',
    color: MAIN_PURPLE,
    marginBottom: 25,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start', // Alinea a la izquierda
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'left', // Alinea a la izquierda
    lineHeight: 22,
    marginBottom: 25,
  },
  // --- TAGS ---
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  tag: {
    borderColor: MAIN_PURPLE,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  tagText: {
    color: MAIN_PURPLE,
    fontWeight: '600',
  },
  // --- FOOTER Y BOTÓN ---
  footer: {
    padding: 25,
    paddingBottom: 40,
  },
  addToCartButton: {
    backgroundColor: MAIN_PURPLE,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#FFD100', // Texto amarillo
    fontSize: 18,
    fontWeight: 'bold',
  },
});