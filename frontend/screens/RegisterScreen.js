// Archivo: screens/RegisterScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import AuthContainer from '../components/AuthContainer.js';
import { styles } from '../styles/registerScreenStyles';
import { register } from '../services/authService';
import { createPet, getSpecies } from '../services/petService';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);

  // Estados para el formulario de USUARIO
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [contrasenaError, setContrasenaError] = useState('');
  const [correoError, setCorreoError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //  Estados para el formulario de MASCOTA
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState(''); // ID de la especie
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petSex, setPetSex] = useState('M'); // M = macho, H = hembra
  const [especies, setEspecies] = useState([]); // Lista de especies del backend
  const [clienteId, setClienteId] = useState(null); // ID del usuario registrado

  //  Cargar especies disponibles al montar el componente
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const speciesData = await getSpecies();
        setEspecies(speciesData);
        // Seleccionar la primera especie por defecto si existe
        if (speciesData.length > 0) {
          setPetType(speciesData[0].id);
        }
      } catch (error) {
        console.error('Error cargando especies:', error);
      }
    };
    loadSpecies();
  }, []);

  useEffect(() => {
    if (confirmContrasena.length > 0) {
      setContrasenaError(
        contrasena !== confirmContrasena 
          ? 'Las contraseñas no coinciden.' 
          : '¡Las contraseñas coinciden!'
      );
    } else {
      setContrasenaError('');
    }
  }, [contrasena, confirmContrasena]);

  useEffect(() => {
    const isValid = 
      nombre.length > 0 && 
      correo.length > 0 && 
      contrasena.length > 6 && 
      correoError === '' && 
      contrasena === confirmContrasena;
    setIsFormValid(isValid);
  }, [nombre, correo, contrasena, confirmContrasena, correoError]);

  const validateCorreo = () => {
    const correoRegex = /\S+@\S+\.\S+/;
    setCorreoError(
      correo.length > 0 && !correoRegex.test(correo) 
        ? 'Por favor, introduce un e-mail válido.' 
        : ''
    );
  };

  const handleNextStep = () => {
    if (isFormValid) {
      setStep(2);
    }
  };

  //  FUNCIÓN CORREGIDA: Ahora registra usuario Y mascota
  const handleFinishRegistration = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Datos del usuario
    const userData = {
      nombre,
      correo,
      contrasena,
    };

    try {
      // 1️⃣ REGISTRAR USUARIO
      console.log('📝 Registrando usuario...');
      const userResponse = await register(userData);
      console.log('✅ Usuario registrado:', userResponse);

      // Extraer el ID del cliente de la respuesta
      const nuevoClienteId = userResponse.usuario?.id;
      
      if (!nuevoClienteId) {
        throw new Error('No se pudo obtener el ID del cliente registrado.');
      }

      setClienteId(nuevoClienteId);

      // 2️⃣ REGISTRAR MASCOTA (si completó el formulario)
      if (petName && petType && breed && age) {
        console.log('🐾 Registrando mascota...');
        
        const petData = {
          nombre: petName,
          especie_id: petType,
          raza: breed,
          edad: parseInt(age, 10),
          sexo: petSex,
        };

        const petResponse = await createPet(nuevoClienteId, petData);
        console.log(' Mascota registrada:', petResponse);
        
        Alert.alert(
          '¡Éxito!', 
          `Tu cuenta y la mascota "${petName}" han sido registradas correctamente.`
        );
      } else {
        Alert.alert(
          '¡Éxito!', 
          'Tu cuenta ha sido creada correctamente. Puedes agregar mascotas más tarde.'
        );
      }

      // 3️⃣ NAVEGAR A LA PANTALLA DE ÉXITO
      navigation.navigate('Success');

    } catch (error) {
      console.error('❌ Error en el registro:', error);
      const errorMessage = 
        error.response?.data?.detail || 
        error.message || 
        'Ocurrió un error al registrarse. Inténtalo de nuevo.';
      Alert.alert('Error de Registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  //  PASO 1: FORMULARIO DE USUARIO
  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <Text style={styles.title}>Registro:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={nombre} 
            onChangeText={setNombre} 
          />
          <TextInput 
            style={[
              styles.input, 
              correo.length > 0 && (correoError ? styles.inputError : styles.inputSuccess)
            ]} 
            placeholder="E-mail" 
            value={correo} 
            onChangeText={setCorreo} 
            keyboardType="email-address" 
            autoCapitalize="none" 
            onBlur={validateCorreo} 
          />
          {correoError ? <Text style={styles.errorMessage}>{correoError}</Text> : null}
          
          <TextInput 
            style={styles.input} 
            placeholder="Contraseña (mín. 6 caracteres)" 
            value={contrasena} 
            onChangeText={setContrasena} 
            secureTextEntry 
          />
          <TextInput 
            style={[
              styles.input, 
              confirmContrasena.length > 0 && 
              (contrasena !== confirmContrasena ? styles.inputError : styles.inputSuccess)
            ]} 
            placeholder="Repetir Contraseña" 
            value={confirmContrasena} 
            onChangeText={setConfirmContrasena} 
            secureTextEntry 
          />
          {contrasenaError ? (
            <Text style={
              contrasena === confirmContrasena ? styles.successMessage : styles.errorMessage
            }>
              {contrasenaError}
            </Text>
          ) : null}
          
          <TouchableOpacity 
            style={[styles.buttonPrimary, !isFormValid && styles.buttonDisabled]} 
            onPress={handleNextStep}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </>
      );
    } 
    
    //  PASO 2: FORMULARIO DE MASCOTA (MEJORADO)
    else if (step === 2) {
      return (
        <>
          <Text style={styles.title}>Añade tu Mascota:</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Nombre de la mascota" 
            value={petName} 
            onChangeText={setPetName} 
          />

          {/* Selector de Especie */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Tipo de mascota:</Text>
            <Picker
              selectedValue={petType}
              onValueChange={(itemValue) => setPetType(itemValue)}
              style={styles.picker}
            >
              {especies.map((especie) => (
                <Picker.Item 
                  key={especie.id} 
                  label={especie.nombre} 
                  value={especie.id} 
                />
              ))}
            </Picker>
          </View>

          <TextInput 
            style={styles.input} 
            placeholder="Raza" 
            value={breed} 
            onChangeText={setBreed} 
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Edad (años)" 
            value={age} 
            onChangeText={setAge} 
            keyboardType="numeric" 
          />

          {/* Selector de Sexo */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Sexo:</Text>
            <Picker
              selectedValue={petSex}
              onValueChange={(itemValue) => setPetSex(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Macho" value="M" />
              <Picker.Item label="Hembra" value="H" />
            </Picker>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.buttonPrimaryFlex} 
              onPress={handleFinishRegistration}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Text>
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
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => navigation.navigate('Login')}
          >
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