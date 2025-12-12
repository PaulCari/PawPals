// frontend/screens/AddPetScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { createPet, getSpecies, getBreedsBySpecies } from '../services/petService';
import { styles } from '../styles/addPetScreenStyles';

const AddPetScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  // Estados del formulario
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

  const handleSavePet = async () => {
    if (!petName.trim() || !breed || !age.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }
    setIsLoading(true);
    try {
      const petData = {
        nombre: petName,
        especie_id: petType,
        raza: breed,
        edad: parseInt(age, 10),
        sexo: petSex
      };
      await createPet(clienteId, petData);
      Alert.alert('¡Éxito!', 'Tu mascota ha sido registrada.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ocurrió un error al registrar la mascota.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = petName.trim() && breed && age.trim() && !razasLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔥 FONDO CON IMAGEN (igual que el perfil) */}
      <ImageBackground
        source={require('../assets/FONDOA.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 🔥 HEADER MORADO con logo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <Image
          source={require('../assets/logo_amarillo.png')}
          style={styles.logo}
        />

        <View style={{ width: 30 }} />
      </View>

      {/* 🔥 CONTENEDOR BLANCO REDONDEADO */}
      <KeyboardAvoidingView 
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TÍTULO */}
          <Text style={styles.headerTitle}>Agregar Mascota</Text>

          {/* SECCIÓN INFO (OPCIONAL) */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="paw" size={24} color="#875686" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Completa los datos de tu mascota para personalizar su experiencia
              </Text>
            </View>
          </View>

          {/* NOMBRE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la mascota</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Max, Luna" 
              value={petName} 
              onChangeText={setPetName}
              placeholderTextColor="#999"
            />
          </View>
          
          {/* TIPO DE MASCOTA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de mascota</Text>
            <View style={styles.pickerContainer}>
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
          </View>
          
          {/* RAZA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raza</Text>
            {razasLoading ? (
              <View style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="small" color="#732C71" />
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker 
                  selectedValue={breed} 
                  onValueChange={setBreed} 
                  style={styles.picker} 
                  enabled={!razasLoading && razas.length > 0}
                >
                  {razas.map((r, index) => (
                    <Picker.Item key={index} label={r} value={r} />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* EDAD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Edad (años)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: 3" 
              value={age} 
              onChangeText={setAge} 
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          
          {/* SEXO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={petSex} 
                onValueChange={setPetSex} 
                style={styles.picker}
              >
                <Picker.Item label="Macho" value="M" />
                <Picker.Item label="Hembra" value="H" />
              </Picker>
            </View>
          </View>

          {/* BOTÓN GUARDAR */}
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!isFormValid || isLoading) && styles.saveButtonDisabled
            ]}
            onPress={handleSavePet}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.saveButtonText}>Guardar Mascota</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPetScreen;