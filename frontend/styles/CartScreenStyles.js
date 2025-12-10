// Archivo: src/styles/CartScreenStyles.js
import { StyleSheet } from 'react-native';

const MAIN_PURPLE = '#875686';
const BACKGROUND_COLOR = '#F9F9F9';
const WHITE = '#FFF';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BACKGROUND_COLOR 
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, // Ajuste para SafeArea en móviles
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: WHITE,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333' 
  },

  // === LISTA DE PRODUCTOS ===
  listContainer: { 
    padding: 20,
    paddingBottom: 100 // Espacio extra para que no se oculte tras el footer
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    // Sombras tarjeta
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 10, 
    marginRight: 15,
    backgroundColor: '#eee', // Color de fondo si no carga imagen
  },
  itemInfo: { 
    flex: 1 
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: { 
    fontSize: 14, 
    color: MAIN_PURPLE, 
    fontWeight: 'bold' 
  },
  quantityContainer: { 
    backgroundColor: '#F0F0F0', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    marginRight: 10 
  },
  quantityText: { 
    fontWeight: 'bold', 
    color: '#555' 
  },
  deleteButton: { 
    padding: 8 
  },

  // === FOOTER (TOTAL Y BOTÓN) ===
  footer: {
    backgroundColor: WHITE,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // Sombras footer superior
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    alignItems: 'center'
  },
  totalLabel: { 
    fontSize: 18, 
    color: '#666' 
  },
  totalAmount: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  checkoutButton: {
    backgroundColor: MAIN_PURPLE,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: { 
    color: WHITE, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  // === ESTADO VACÍO ===
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: -50 // Para centrar visualmente descontando el header
  },
  emptyText: { 
    fontSize: 18, 
    color: '#888', 
    marginTop: 15, 
    marginBottom: 25 
  },
  continueButton: { 
    paddingVertical: 12, 
    paddingHorizontal: 25,
    backgroundColor: MAIN_PURPLE, 
    borderRadius: 25 
  },
  continueButtonText: { 
    color: WHITE,
    fontSize: 16,
    fontWeight: '600'
  }
});