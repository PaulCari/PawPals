// Archivo: styles/productCardStyles.js

import { StyleSheet } from 'react-native';

const MAIN_PURPLE = '#875686';
const ORANGE = '#FF8C42';
const YELLOW = '#FFD100';

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 250,
    marginRight: 20,
    padding: 15,
    paddingTop: 160,
    paddingBottom: 35,
    height: 420,
    justifyContent: 'space-between',
     //   Espacio para que la imagen sobresalga
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 60, 
    overflow: 'visible',
  },

  spacer: {
    flex: 0.0001, 
    width: '100%',
  },

  infoContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  // === TARJETA DEL CENTRO DESTACADA ===
  centerCard: {
    borderWidth: 3,
    borderColor: YELLOW,
    shadowColor: YELLOW,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  // === BADGE "DESTACADO" ===
  highlightBadge: {
    position: 'absolute',
    top: 45,
    right: 15,
    backgroundColor: YELLOW,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: YELLOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: MAIN_PURPLE,
  },
  image: {
    width: 230, // 🔥 Imagen más grande
    height: 200,
    borderRadius: 100,
    position: 'absolute', // 🔥 Posición absoluta
    top: -60, // 🔥 Sobresale hacia arriba
    resizeMode: 'cover',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
  fontSize: 14,
  color: '#996698',
  textAlign: 'center',
  marginBottom: 10,
  marginTop: 5,
  paddingHorizontal: 5,
  fontWeight: 'bold', // o 'OpenSans-Regular' si no quieres tan grueso
},
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color:  '#60395F',
    marginBottom: 15,
    marginTop: 0,
  },
  footer: {
  width: '100%',
  alignItems: 'center',
  marginBottom: 25, // 
  },

addToCartButton: {
  backgroundColor: '#FF8C00',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 8,
  paddingHorizontal: 20,
  borderRadius: 15,
  marginBottom: 6,
},

addToCartText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
  marginLeft: 6,
},

seeMoreText: {
  color: MAIN_PURPLE,
  fontWeight: 'bold',
  fontSize: 14,
  textAlign: 'center',
},

});