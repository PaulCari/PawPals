import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { login } from '../services/authService';
import AuthContainer from '../components/AuthContainer'; // Reutilizamos el contenedor
import { styles } from '../styles/loginScreenStyles'; // Usamos los nuevos estilos

const LoginScreen = ({ navigation }) => {
  // --- LÓGICA EXISTENTE (INTACTA) ---
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor, introduce tu correo y contraseña.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await login(correo, contrasena);
      if (response && response.token) {
        navigation.replace('Home');
      } else {
        const serverMessage = response.detail || 'Usuario o contraseña incorrectos.';
        Alert.alert('Error de inicio de sesión', serverMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ocurrió un problema al conectar con el servidor.';
      Alert.alert('Error de inicio de sesión', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  // --- NUEVA ESTRUCTURA VISUAL BASADA EN FIGMA ---
  return (
    <AuthContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to PawPals</Text>

        <TextInput
          style={styles.input}
          placeholder="User / E-mail"
          placeholderTextColor="#888"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={true}
          value={contrasena}
          onChangeText={setContrasena}
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>

        <TouchableOpacity style={styles.registerContainer} onPress={goToRegister}>
          <Text style={styles.registerText}>
            ¿No tienes una cuenta? <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthContainer>
  );
};

export default LoginScreen;