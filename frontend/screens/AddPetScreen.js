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

//  IMPORTAR NOTIFICACIÓN
import SuccessNotification from '../components/SuccessNotification';

const AddPetScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  // Estados del formulario
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petSex, setPetSex] = useState('M');

  // Estados de datos
  const [especies, setEspecies] = useState([]);
  const [razas, setRazas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [razasLoading, setRazasLoading] = useState(false);

  //  NUEVO: Estado para mostrar la notificación
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar especies
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

  // Cargar razas al cambiar especie
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

  // 🔥 FUNCIÓN MODIFICADA CON NOTIFICACIÓN
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

      //  Mostrar notificación de éxito
      setIsLoading(false);
      setShowSuccess(true);

    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        'Ocurrió un error al registrar la mascota.';

      Alert.alert('Error', errorMessage);
      setIsLoading(false);
    }
  };

  //  SE EJECUTA CUANDO LA ANIMACIÓN TERMINA
  const handleNotificationComplete = () => {
    console.log('📱 Volviendo a PetProfile...');
    setShowSuccess(false);
    navigation.goBack(); //  Vuelve a la pantalla anterior (PetProfile)
  };

  const isFormValid = petName.trim() && breed && age.trim() && !razasLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/FONDOA.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* HEADER */}
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

      {/* FORMULARIO */}
      <KeyboardAvoidingView
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Agregar Mascota</Text>

          {/* INFO */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="paw" size={24} color="#875686" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Completa los datos de tu mascota para personalizar su experiencia
              </Text>
            </View>
          </View>

          {/* INPUTS */}
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

          {/* BOTÓN */}
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

      {/*  NOTIFICACIÓN DE ÉXITO */}
      {showSuccess && (
        <SuccessNotification
          message={`¡${petName} ha sido agregado a tu perfil! 🐾`}
          onComplete={handleNotificationComplete}
        />
      )}
    </SafeAreaView>
  );
};

export default AddPetScreen;