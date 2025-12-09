// frontend/styles/productCardStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 250,
    marginRight: 20,
    padding: 15,
    alignItems: 'center', // Centra el contenido
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75, // Para que sea un círculo
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#875686', // Morado
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  addToCartText: {
    color: '#875686',
    fontWeight: 'bold',
  },
  seeMoreText: {
    color: '#aaa',
  },
});