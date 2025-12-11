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
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#875686" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Mascota</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
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

          <TouchableOpacity 
            style={[styles.saveButton, (!isFormValid || isLoading) && styles.saveButtonDisabled]}
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