// frontend/styles/favoritesScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';
const ORANGE = '#FF8C42';
const LIGHT_BACKGROUND = '#F9F9F9';
const SOFT_RED = '#FF6B6B'; // Para el botón de eliminar

export const styles = StyleSheet.create({
  // === 1. CONTENEDOR PRINCIPAL (similar a HomeScreen) ===
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },

  // === 2. HEADER MORADO (prácticamente idéntico a HomeScreen) ===
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 10,
    paddingBottom: 15, // ✅ IGUAL QUE HOME
    },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },

  logo: {
  width: 160, // O el tamaño que prefieras
  height: 120,
  resizeMode: 'contain',
},

  // === 3. CONTENEDOR BLANCO ===
    container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    },

  // === 4. CONTADOR DE FAVORITOS ===
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 25,
    marginBottom: 20,
  },

  // === 5. LISTA Y TARJETAS ===
  listContent: {
    paddingHorizontal: 20,
    // Dejamos espacio abajo para la barra de navegación flotante
    paddingBottom: 120, 
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center', // Para centrar verticalmente
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 15, // Un poco menos redondeado que el círculo completo
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between', // Espacia el contenido interno
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MAIN_PURPLE,
  },
  removeButton: {
    padding: 8, // Aumenta el área de toque del botón
    backgroundColor: '#FFF0F0', // Un fondo rojo muy suave
    borderRadius: 20,
  },

  // === 6. ESTADOS DE CARGA Y VACÍO ===
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50, // Para que no quede tan pegado abajo
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: ORANGE,
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  titleContainer: {
  paddingHorizontal: 25,
  marginBottom: 20,
},

screenTitle: {
  fontSize: 28,          // ✅ Más grande
  fontWeight: '800',     // ✅ Más presencia
  color: '#732C71',
  letterSpacing: 0.3,    // ✅ Elegante
  marginBottom: 10,
},

countText: {
  fontSize: 15,
  fontWeight: '500',
  color: '#8A8A8A',
  marginLeft: 5,         // ✅ alineado suave con el título
},
});