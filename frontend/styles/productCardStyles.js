// Archivo: styles/productCardStyles.js

import { StyleSheet } from 'react-native';

const MAIN_PURPLE = '#875686';

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 25, // Un poco más redondeado
    padding: 16, // Espaciado interno consistente
    width: 230, // Un poco más ancho para que respire el contenido
    marginRight: 15,
    // --- Sombra pronunciada para dar profundidad (CLAVE) ---
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Sombra más larga hacia abajo
    },
    shadowOpacity: 0.1, // Sombra sutil
    shadowRadius: 8,   // Sombra más difuminada
    elevation: 8,      // Sombra para Android
  },
  image: {
    width: '100%',
    height: 125, // Un poco más alta
    borderRadius: 18,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2c2c2c', // Negro no tan puro
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    minHeight: 20, // Altura mínima para alinear tarjetas
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4, // Pequeño ajuste de alineación
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: MAIN_PURPLE,
  },
  seeMoreText: {
    fontSize: 13,
    color: '#999',
  },
});