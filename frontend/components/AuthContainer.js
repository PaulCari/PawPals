// components/AuthContainer.js
import React from 'react';
import { View, Image, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';

const backgroundImage = require('../assets/fondo.jpg'); // Imagen de fondo
const logo = require('../assets/logo.png'); // Logo

const AuthContainer = ({ children }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      {/* Capa con degradado encima de la imagen */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
        <Image source={logo} style={styles.logo} />
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Ocupa todo el fondo
    backgroundColor: 'rgba(96, 57, 95, 0.4)', // morado con 30% opacidad
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    position: 'absolute',
    top: 50,
  },
});

export default AuthContainer;
