// Archivo: screens/RegisterScreen.js (CON VALIDACIÓN MEJORADA)

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Picker, ActivityIndicator } from 'react-native';
import AuthContainer from '../components/AuthContainer.js';
import { styles } from '../styles/registerScreenStyles';
import { register } from '../services/authService';
import { createPet, getSpecies } from '../services/petService';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petSex, setPetSex] = useState('M');
  const [especies, setEspecies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
    
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const speciesData = await getSpecies();
        setEspecies(speciesData);
        if (speciesData.length > 0) setPetType(speciesData[0].id);
      } catch (error) {
        console.error('❌ Error cargando especies:', error);
      }
    };
    loadSpecies();
  }, []);

  useEffect(() => {
    // ✅ VALIDACIÓN MEJORADA
    const isValid =
      nombre.trim().length > 0 &&
      /\S+@\S+\.\S+/.test(correo) &&
      contrasena.length >= 6 &&
      contrasena.length <= 72 && // ✅ Límite de bcrypt
      contrasena === confirmContrasena;
    setIsFormValid(isValid);
  }, [nombre, correo, contrasena, confirmContrasena]);

  const handleNextStep = () => {
    // ✅ VALIDACIÓN ADICIONAL
    if (contrasena.length > 72) {
      Alert.alert('Contraseña demasiado larga', 'La contraseña no puede tener más de 72 caracteres.');
      return;
    }
    if (isFormValid) setStep(2);
  };

  // ✅ FUNCIÓN PARA REGISTRAR USUARIO + MASCOTA
  const handleFinishRegistration = async () => {
    if (isLoading) return;
    
    if (!petName.trim() || !breed.trim() || !age.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos de la mascota.');
      return;
    }

    setIsLoading(true);
    console.log('🔹 Iniciando registro CON mascota...');

    try {
      console.log('🌐 Registrando usuario...');
      const userResponse = await register({ nombre, correo, contrasena });
      console.log('✅ Usuario registrado:', userResponse);

      const nuevoClienteId = userResponse.usuario?.id;
      
      if (!nuevoClienteId) {
        throw new Error('No se pudo obtener el ID del cliente.');
      }

      console.log('🐾 Registrando mascota...');
      const petData = { 
        nombre: petName, 
        especie_id: petType, 
        raza: breed, 
        edad: parseInt(age, 10), 
        sexo: petSex 
      };
      await createPet(nuevoClienteId, petData);
      console.log('✅ Mascota registrada exitosamente');
        
      navigation.replace('Success');

    } catch (error) {
      console.error('❌ ERROR:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Ocurrió un error al registrarse.';
      Alert.alert('Error de Registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FUNCIÓN PARA OMITIR MASCOTA
  const handleSkipPet = async () => {
    if (isLoading) return;
    setIsLoading(true);

    console.log('🔹 Iniciando registro SIN mascota...');
    console.log('📤 Datos:', { nombre, correo, contrasena: '***' });

    try {
      console.log('🌐 Llamando a register()...');
      const userResponse = await register({ nombre, correo, contrasena });
      console.log('✅ Respuesta:', userResponse);

      const nuevoClienteId = userResponse.usuario?.id;
      
      if (!nuevoClienteId) {
        console.error('❌ No se recibió ID del cliente');
        throw new Error('No se pudo obtener el ID del cliente.');
      }

      console.log('✅ Cliente ID:', nuevoClienteId);
      console.log('🚀 Navegando a Success...');
      navigation.replace('Success');

    } catch (error) {
      console.error('❌ ERROR CAPTURADO:', error);

      let errorMessage = 'Ocurrió un error al registrarse.';

      if (error.response) {
        console.error('❌ Server Response:', error.response.data);
        console.error('❌ Status:', error.response.status);
        errorMessage = error.response.data?.detail || errorMessage;
      } else if (error.request) {
        console.error('❌ No response from server');
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
      } else {
        console.error('❌ Setup Error:', error.message);
        errorMessage = error.message;
      }

      Alert.alert('Error de Registro', errorMessage);
    } finally {
      console.log('🔹 Finalizando...');
      setIsLoading(false);
    }
  };

  const renderUserForm = () => (
    <>
      <Text style={styles.title}>Registro:</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nombre" 
        value={nombre} 
        onChangeText={setNombre} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="E-mail" 
        value={correo} 
        onChangeText={setCorreo} 
        keyboardType="email-address" 
        autoCapitalize="none" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña (6-72 caracteres)" 
        value={contrasena} 
        onChangeText={setContrasena} 
        secureTextEntry 
        maxLength={72} // ✅ Límite en el input
      />
      <TextInput 
        style={styles.input} 
        placeholder="Repetir Contraseña" 
        value={confirmContrasena} 
        onChangeText={setConfirmContrasena} 
        secureTextEntry 
        maxLength={72} // ✅ Límite en el input
      />
      
      <TouchableOpacity 
        style={[
          styles.buttonPrimary, 
          !isFormValid && styles.buttonDisabled
        ]}
        onPress={handleNextStep}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </>
  );

  const renderPetForm = () => {
    const isPetFormValid = petName.trim() && breed.trim() && age.trim();

    return (
      <>
        <Text style={styles.title}>Añade tu Mascota:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nombre de la mascota" 
          value={petName} 
          onChangeText={setPetName} 
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Tipo de mascota:</Text>
          <Picker 
            selectedValue={petType} 
            onValueChange={setPetType} 
            style={styles.picker}
          >
            {especies.map(e => (
              <Picker.Item key={e.id} label={e.nombre} value={e.id} />
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
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Sexo:</Text>
          <Picker 
            selectedValue={petSex} 
            onValueChange={setPetSex} 
            style={styles.picker}
          >
            <Picker.Item label="Macho" value="M" />
            <Picker.Item label="Hembra" value="H" />
          </Picker>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.buttonFlex, styles.buttonSecondary]}
            onPress={handleSkipPet}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#732C71" size="small" />
            ) : (
              <Text style={styles.buttonSecondaryText}>Omitir</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.buttonFlex,
              { backgroundColor: '#732C71' },
              (!isPetFormValid || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleFinishRegistration}
            disabled={!isPetFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <AuthContainer>
      <View style={styles.card}>
        {step === 1 ? renderUserForm() : renderPetForm()}

        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, step === 1 && styles.progressDotActive]} />
          <View style={[styles.progressDot, step === 2 && styles.progressDotActive]} />
        </View>
      </View>
    </AuthContainer>
  );
};

export default RegisterScreen;