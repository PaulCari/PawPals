import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { login } from '../services/authService';
import { styles } from '../styles/loginScreenStyles';

const logo = require('../assets/logo.png');

const LoginScreen = ({ navigation }) => {
  const [correo, setcorreo] = useState('');
  const [contrasena, setcontrasena] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const maskPassword = (pw) => {
    if (!pw) return '';
    return '*'.repeat(Math.min(pw.length, 4)) + (pw.length > 4 ? `(+${pw.length - 4})` : '');
  };

  const handleLogin = async () => {
    console.log('--- handleLogin iniciado ---');
    console.log('Comprobando navigation:', !!navigation, navigation ? typeof navigation.replace : 'sin navigation');

    if (!correo || !contrasena) {
      console.warn('handleLogin: faltan datos de entrada.', { correo, contrasenaMasked: maskPassword(contrasena) });
      Alert.alert('Error', 'Por favor, introduce tu correo y contraseña.');
      return;
    }

    console.log('Intentando iniciar sesión con:', { correo, contrasenaMasked: maskPassword(contrasena) });
    setIsLoading(true);
    const startTime = Date.now();

    try {
      console.log('Llamando a authService.login(...)');
      const response = await login(correo, contrasena);
      const duration = Date.now() - startTime;
      console.log(`Respuesta recibida del servicio de autenticación (t=${duration}ms):`, response);

      if (!response) {
        console.error('handleLogin: response es nulo/indefinido. Revisar authService/login.');
        Alert.alert('Error', 'No se recibió respuesta del servidor. Intenta nuevamente.');
        return;
      }

      const success = response.success ?? (response.token ? true : false);

      if (success) {
        console.log('✅ Login considerado exitoso por las comprobaciones locales.', {
          tokenPresent: !!response.token,
          successField: response.success
        });

        if (!navigation || typeof navigation.replace !== 'function') {
          console.error('Navigation inválido: no se puede navegar a HomeScreen.', navigation);
          Alert.alert('Error', 'No se puede cambiar de pantalla (navigation inválido).');
          return;
        }

        console.log("Redirigiendo a 'HomeScreen' (navigation.replace('HomeScreen'))");
        navigation.replace('Home');
      } else {
        console.warn('❌ Login fallido según la respuesta del servidor.', response);
        const serverMessage = response.message || response.error || 'Usuario o contraseña incorrectos.';
        Alert.alert('Error de inicio de sesión', serverMessage);
      }
    } catch (error) {
      console.error('🔥 Error durante el proceso de login (catch):', error);
      if (error?.response) {
        console.error('Error.response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      Alert.alert('Error de inicio de sesión', 'Ocurrió un problema al conectar con el servidor. Revisa la consola para más detalles.');
    } finally {
      setIsLoading(false);
      console.log('--- handleLogin finalizado ---');
    }
  };
  
  const goToRegister = () => {
    console.log("Navegando a 'RegisterScreen' (navigation.navigate)");
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Welcome to PawPals</Text>

      <TextInput
        style={styles.input}
        placeholder="User / E-mail"
        placeholderTextColor="#888"
        value={correo}
        onChangeText={setcorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        secureTextEntry={true}
        value={contrasena}
        onChangeText={setcontrasena}
      />
      
      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      
      <TouchableOpacity onPress={goToRegister}>
        <Text style={styles.linkText}>
          ¿No tienes una cuenta? <Text style={styles.registerLink}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;