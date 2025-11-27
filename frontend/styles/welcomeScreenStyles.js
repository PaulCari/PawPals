import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
    marginTop: 2,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#FFD100',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 25,
    color: '#60395F',
    fontWeight: 'bold',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  registerText: {
    color: 'white',
    fontSize: 20,
  },
  registerLink: {
    fontWeight: 'bold',
    color: '#FFD100',
  },
  overlay2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(39, 36, 36, 0.3)',
  },
});