import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const MAIN_PURPLE = '#875686';
const LIGHT_BACKGROUND = '#F9F9F9';

export const styles = StyleSheet.create({
  // === CONTENEDORES PRINCIPALES ===
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },
  container: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },

  // === FONDO DECORATIVO (Patitas y huesos) ===
  ellipseImage: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 300,
    height: 300,
    resizeMode: 'contain',
    opacity: 0.2, // Un poco transparente
  },
  pawImage: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 60,
    height: 60,
    opacity: 0.3,
    resizeMode: 'contain',
    transform: [{ rotate: '15deg' }],
  },
  boneImage: {
    position: 'absolute',
    top: 150,
    left: 10,
    width: 50,
    height: 50,
    opacity: 0.3,
    resizeMode: 'contain',
    transform: [{ rotate: '-20deg' }],
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Separa logo y carrito
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cartButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
  },

  // === CUERPO BLANCO (La parte curva) ===
  bodyContainer: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    overflow: 'hidden', // Para que el contenido no se salga de las curvas
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  // === CATEGORÍAS ===
  categoryContainer: {
    paddingLeft: 20,
    marginBottom: 20,
    height: 40,
  },
  categoryButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
  },
  activeCategoryButton: {
    backgroundColor: MAIN_PURPLE,
    borderColor: MAIN_PURPLE,
  },
  categoryText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // === LISTA DE PRODUCTOS ===
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para que el último item se vea bien
  },

  // === ESTADOS DE CARGA Y VACÍO ===
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MAIN_PURPLE,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});