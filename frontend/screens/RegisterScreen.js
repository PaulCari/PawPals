// Archivo: screens/RegisterScreen.js

import React, { useState, useEffect } from 'react';
// Importamos 'Alert' para mostrar mensajes al usuario
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AuthContainer from '../components/AuthContainer.js';
import { styles } from '../styles/registerScreenStyles';
// Importamos nuestra función 'register' del servicio
import { register } from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);

  // Estados para el formulario de USUARIO
  const [correo, setcorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contrasena, setcontrasena] = useState('');
  const [confirmcontrasena, setConfirmcontrasena] = useState('');
  const [contrasenaError, setcontrasenaError] = useState('');
  const [correoError, setcorreoError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback de carga

  // Estados para el formulario de MASCOTA
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (confirmcontrasena.length > 0) {
      setcontrasenaError(contrasena !== confirmcontrasena ? 'Las contraseñas no coinciden.' : '¡Las contraseñas coinciden!');
    } else {
      setcontrasenaError('');
    }
  }, [contrasena, confirmcontrasena]);

  useEffect(() => {
    const isValid = nombre.length > 0 && correo.length > 0 && contrasena.length > 6 && correoError === '' && contrasena === confirmcontrasena;
    setIsFormValid(isValid);
  }, [nombre, correo, contrasena, confirmcontrasena, correoError]);

  const validatecorreo = () => {
    const correoRegex = /\S+@\S+\.\S+/;
    setcorreoError(correo.length > 0 && !correoRegex.test(correo) ? 'Por favor, introduce un e-mail válido.' : '');
  };

  const handleNextStep = () => {
    if (isFormValid) {
      setStep(2);
    }
  };

  const handleFinishRegistration = async () => {
    // Prevenir doble clic
    if (isLoading) return;
    setIsLoading(true);

    const userData = {
      nombre,
      correo,
      contrasena,
    };

    try {
      // Llamamos a nuestro servicio de registro
      const response = await register(userData);
      
      console.log('Respuesta del registro:', response);
      Alert.alert('¡Éxito!', 'Tu cuenta ha sido creada correctamente.');
      
      // Navegamos a la pantalla de éxito
      navigation.navigate('Success');

    } catch (error) {
      // Si el backend envía un mensaje de error específico, lo mostramos.
      // Si no, mostramos un mensaje genérico.
      const errorMessage = error.response?.data?.detail || 'Ocurrió un error al registrarse. Inténtalo de nuevo.';
      Alert.alert('Error de Registro', errorMessage);
    } finally {
      // Reactivamos el botón
      setIsLoading(false);
    }
    // Nota: La lógica para registrar la mascota se podría añadir aquí en el futuro.
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <Text style={styles.title}>Registro:</Text>
          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
          <TextInput style={[styles.input, correo.length > 0 && (correoError ? styles.inputError : styles.inputSuccess)]} placeholder="E-mail" value={correo} onChangeText={setcorreo} keyboardType="email-address" autoCapitalize="none" onBlur={validatecorreo} />
          {correoError ? <Text style={styles.errorMessage}>{correoError}</Text> : null}
          <TextInput style={styles.input} placeholder="Contraseña (mín. 6 caracteres)" value={contrasena} onChangeText={setcontrasena} secureTextEntry />
          <TextInput style={[styles.input, confirmcontrasena.length > 0 && (contrasena !== confirmcontrasena ? styles.inputError : styles.inputSuccess)]} placeholder="Repetir Contraseña" value={confirmcontrasena} onChangeText={setConfirmcontrasena} secureTextEntry />
          {contrasenaError ? <Text style={contrasena === confirmcontrasena ? styles.successMessage : styles.errorMessage}>{contrasenaError}</Text> : null}
          <TouchableOpacity 
            style={[styles.buttonPrimary, !isFormValid && styles.buttonDisabled]} 
            onPress={handleNextStep}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <Text style={styles.title}>Añade tu Mascota:</Text>
          <TextInput style={styles.input} placeholder="Nombre de la mascota" value={petName} onChangeText={setPetName} />
          <TextInput style={styles.input} placeholder="Tipo de mascota (ej. Perro, Gato)" value={petType} onChangeText={setPetType} />
          <TextInput style={styles.input} placeholder="Raza" value={breed} onChangeText={setBreed} />
          <TextInput style={styles.input} placeholder="Edad" value={age} onChangeText={setAge} keyboardType="numeric" />
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.buttonPrimaryFlex} 
              onPress={handleFinishRegistration}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>{isLoading ? 'Guardando...' : 'Guardar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.buttonSecondaryFlex} 
              onPress={() => navigation.navigate('Success')}
            >
              <Text style={styles.buttonSecondaryText}>Omitir</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  return (
    <AuthContainer>
      <View style={styles.card}>
        <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={styles.activeTabText}>Regístrate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.tabText}>Iniciar sesión</Text>
            </TouchableOpacity>
        </View>
        {renderStepContent()}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, step === 1 && styles.progressDotActive]} />
          <View style={[styles.progressDot, step === 2 && styles.progressDotActive]} />
        </View>
      </View>
    </AuthContainer>
  );
};

export default RegisterScreen;