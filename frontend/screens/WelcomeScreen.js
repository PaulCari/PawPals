import React from 'react';
// StyleSheet ya no se importa aquí
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
// Paso 1: Importar los estilos desde su nueva ubicación
import { styles } from '../styles/welcomeScreenStyles';

const backgroundImage = require('../assets/fondo.jpg');
const logo = require('../assets/logo.png');

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.overlay2} />
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
             <Text style={styles.registerText}>
              ¿No tienes una cuenta? <Text style={styles.registerLink}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;