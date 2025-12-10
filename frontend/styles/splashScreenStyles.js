// frontend/styles/splashScreenStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#875686', // Color morado principal
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  logo: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
    zIndex: 10,
  },
  
  // ===== CÍRCULOS DECORATIVOS =====
  
  // Círculo superior izquierdo (morado oscuro)
  circleTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(96, 57, 95, 0.6)',
  },
  
  // Círculo superior derecho (amarillo)
  circleTopRight: {
    position: 'absolute',
    top: -50,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFD100',
  },
  
  // Círculo inferior izquierdo (amarillo)
  circleBottomLeft: {
    position: 'absolute',
    bottom: -120,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFD100',
  },
  
  // Círculo inferior derecho (morado oscuro)
  circleBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(96, 57, 95, 0.7)',
  },
  
  // Agregar estos estilos si usas imágenes:

  // ===== HUESITOS CON IMÁGENES =====
boneImage1: {
  position: 'absolute',
  top: 90,
  left: 150,
  width: 100,
  height: 100,
  opacity: 0.25,
  transform: [{ rotate: '0deg' }],
  resizeMode: 'contain',
},

boneImage2: {
  position: 'absolute',
  bottom: 420,
  top: 290,
  right: 15,
  width: 90,
  height: 90,
  opacity: 0.25,
  transform: [{ rotate: '200deg' }],
  resizeMode: 'contain',
},
  // ===== PATITAS CON IMÁGENES =====
  pawImage1: {
    position: 'absolute',
    top: 260,
    left: -20,
    width: 140,
    height: 140,
    opacity: 0.35,
    resizeMode: 'contain',
  },
  
  pawImage2: {
    position: 'absolute',
    bottom: 200,
    right: 60,
    width: 90,
    height: 90,
    opacity: 0.35,
    transform: [{ rotate: '-60deg' }],
    resizeMode: 'contain',
  },
  
  pawImage3: {
    position: 'absolute',
    bottom: 280,
    left: 30,
    width: 60,
    height: 60,
    opacity: 0.4,
    resizeMode: 'contain',
  },
});