// frontend/styles/homeScreenStyles.js
import { StyleSheet, Platform } from 'react-native';

const MAIN_PURPLE = '#875686';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MAIN_PURPLE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
    height: 90,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  categoryScrollView: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  categoryButton: {
    marginRight: 20,
    paddingBottom: 5,
  },
  activeCategoryButton: {
    borderBottomWidth: 3,
    borderBottomColor: MAIN_PURPLE,
  },
  categoryText: {
    fontSize: 16,
    color: '#999',
  },
  activeCategoryText: {
    color: MAIN_PURPLE,
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
});