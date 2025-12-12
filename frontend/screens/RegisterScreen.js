import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Picker, ActivityIndicator } from 'react-native';
import AuthContainer from '../components/AuthContainer.js';
import { styles } from '../styles/registerScreenStyles';
import { register } from '../services/authService';
import { createPet, getSpecies, getBreedsBySpecies } from '../services/petService';

const RegisterScreen = ({ navigation }) => {
  // --- ESTADOS ---
  const [step, setStep] = useState(1);
  // Estados del formulario de usuario
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmContrasena, setConfirmContrasena] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Estados del formulario de mascota
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petSex, setPetSex] = useState('M');
  
  // Estados de datos y carga
  const [especies, setEspecies] = useState([]);
  const [razas, setRazas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [razasLoading, setRazasLoading] = useState(false);

  // ✅ NUEVO ESTADO: para guardar los datos del usuario registrado
  const [userData, setUserData] = useState(null);

  // --- LÓGICA DE CARGA DE DATOS (useEffect) ---
  
  // Carga las especies al iniciar
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

  // Carga las razas cuando cambia el tipo de mascota
  useEffect(() => {
    const loadBreeds = async () => {
      if (!petType) return;
      setRazasLoading(true);
      setRazas([]);
      try {
        const breedsData = await getBreedsBySpecies(petType);
        setRazas(breedsData);
        if (breedsData.length > 0) setBreed(breedsData[0]);
      } catch (error) {
        console.error('❌ Error cargando razas:', error);
      } finally {
        setRazasLoading(false);
      }
    };
    loadBreeds();
  }, [petType]);

  // Valida el formulario del usuario
  useEffect(() => {
    const isValid =
      nombre.trim().length > 0 &&
      /\S+@\S+\.\S+/.test(correo) &&
      contrasena.length >= 6 &&
      contrasena.length <= 72 &&
      contrasena === confirmContrasena;
    setIsFormValid(isValid);
  }, [nombre, correo, contrasena, confirmContrasena]);

  // --- MANEJADORES DE ACCIONES ---

  // ✅ LÓGICA CORREGIDA: Ahora registra al usuario y avanza
  const handleNextStep = async () => {
    if (isLoading || !isFormValid) return;
    setIsLoading(true);
    try {
      console.log('🌐 Registrando usuario...');
      const response = await register({ nombre, correo, contrasena });
      console.log('✅ Usuario registrado:', response);
      
      setUserData(response.usuario); // Guardamos los datos del usuario
      setStep(2); // Avanzamos al siguiente paso
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ocurrió un error al registrar el usuario.';
      Alert.alert('Error de Registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LÓGICA CORREGIDA: Ahora solo registra la mascota
  const handleFinishRegistration = async () => {
    if (isLoading || !userData?.cliente_id) return;
    if (!petName.trim() || !breed || !age.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos de la mascota.');
      return;
    }
    setIsLoading(true);
    try {
      const clienteId = userData.cliente_id;
      console.log(`🐾 Registrando mascota para el cliente ID: ${clienteId}`);
      const petData = { nombre: petName, especie_id: petType, raza: breed, edad: parseInt(age, 10), sexo: petSex };
      await createPet(clienteId, petData);
      console.log('✅ Mascota registrada exitosamente');
      navigation.replace('Success', { clienteId });
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ocurrió un error al registrar la mascota.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LÓGICA CORREGIDA: Ahora solo navega
  const handleSkipPet = () => {
    console.log('🚀 Omitiendo registro de mascota, navegando a Success...');
    const clienteId = userData?.cliente_id;

    if (clienteId) {
      navigation.replace('Success', { clienteId });
    } else {
      navigation.replace('Login');
    }
  };

  // --- RENDERIZADO DE COMPONENTES ---

  const renderUserForm = () => (
    <>
      <Text style={styles.title}>Registro:</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="E-mail" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña (6-72 caracteres)" value={contrasena} onChangeText={setContrasena} secureTextEntry maxLength={72} />
      <TextInput style={styles.input} placeholder="Repetir Contraseña" value={confirmContrasena} onChangeText={setConfirmContrasena} secureTextEntry maxLength={72} />
      
<TouchableOpacity 
  style={[styles.button, styles.buttonPrimary, (!isFormValid || isLoading) && styles.buttonDisabled]}
  onPress={handleNextStep}
  disabled={!isFormValid || isLoading}
>
  {isLoading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={!isFormValid ? styles.buttonTextDisabled : styles.buttonText}>
      Siguiente
    </Text>
  )}
</TouchableOpacity>
    </>
  );

  const renderPetForm = () => {
    const isPetFormValid = petName.trim() && breed && age.trim() && !razasLoading;

    return (
      <>
        <Text style={styles.title}>Añade tu Mascota:</Text>
        <TextInput style={styles.input} placeholder="Nombre de la mascota" value={petName} onChangeText={setPetName} />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Tipo de mascota:</Text>
          <Picker selectedValue={petType} onValueChange={setPetType} style={styles.picker}>
            {especies.map(e => <Picker.Item key={e.id} label={e.nombre} value={e.id} />)}
          </Picker>
        </View>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Raza:</Text>
          {razasLoading ? (
            <ActivityIndicator size="small" color="#732C71" style={{ height: 40 }}/>
          ) : (
            <Picker selectedValue={breed} onValueChange={setBreed} style={styles.picker} enabled={!razasLoading && razas.length > 0}>
              {razas.map((r, index) => <Picker.Item key={index} label={r} value={r} />)}
            </Picker>
          )}
        </View>

        <TextInput style={styles.input} placeholder="Edad (años)" value={age} onChangeText={setAge} keyboardType="numeric" />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Sexo:</Text>
          <Picker selectedValue={petSex} onValueChange={setPetSex} style={styles.picker}>
            <Picker.Item label="Macho" value="M" />
            <Picker.Item label="Hembra" value="H" />
          </Picker>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.buttonFlex, styles.buttonSecondary]} onPress={handleSkipPet} disabled={isLoading}>
            <Text style={styles.buttonSecondaryText}>Omitir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonFlex, { backgroundColor: '#732C71' }, (!isPetFormValid || isLoading) && styles.buttonDisabled]} onPress={handleFinishRegistration} disabled={!isPetFormValid || isLoading}>
            {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.buttonText}>Guardar</Text>}
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