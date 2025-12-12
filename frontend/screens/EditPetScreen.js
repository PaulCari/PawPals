// frontend/screens/EditPetScreen.js

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
import * as ImagePicker from 'expo-image-picker';
import { updatePet, getSpecies, getBreedsBySpecies } from '../services/petService';
import { styles } from '../styles/addPetScreenStyles'; // Reutilizamos los mismos estilos
import SuccessNotification from '../components/SuccessNotification';

const EditPetScreen = ({ navigation, route }) => {
  const { clienteId, petId, existingPet } = route.params || {};

  // Estados del formulario
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petSex, setPetSex] = useState('M');
  const [weight, setWeight] = useState('');
  const [observations, setObservations] = useState('');
  const [petPhoto, setPetPhoto] = useState(null);

  // Estados de datos
  const [especies, setEspecies] = useState([]);
  const [razas, setRazas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [razasLoading, setRazasLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar datos existentes
  useEffect(() => {
    if (existingPet) {
      setPetName(existingPet.nombre || '');
      setAge(existingPet.edad?.toString() || '');
      setPetSex(existingPet.sexo || 'M');
      setWeight(existingPet.peso?.toString() || '');
      setObservations(existingPet.observaciones || '');
      
      if (existingPet.foto) {
        setPetPhoto({ uri: existingPet.foto });
      }
    }
  }, [existingPet]);

  // Cargar especies
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const speciesData = await getSpecies();
        setEspecies(speciesData);
        
        // Buscar la especie del pet existente
        if (existingPet?.especie) {
          const matchingSpecies = speciesData.find(
            s => s.nombre.toLowerCase() === existingPet.especie.toLowerCase()
          );
          if (matchingSpecies) {
            setPetType(matchingSpecies.id);
          }
        }
      } catch (error) {
        console.error('❌ Error cargando especies:', error);
      }
    };
    loadSpecies();
  }, [existingPet]);

  // Cargar razas al cambiar especie
  useEffect(() => {
    const loadBreeds = async () => {
      if (!petType) return;
      setRazasLoading(true);
      setRazas([]);

      try {
        const breedsData = await getBreedsBySpecies(petType);
        setRazas(breedsData);
        
        // Establecer la raza actual si existe
        if (existingPet?.raza && breedsData.includes(existingPet.raza)) {
          setBreed(existingPet.raza);
        } else if (breedsData.length > 0) {
          setBreed(breedsData[0]);
        }
      } catch (error) {
        console.error('❌ Error cargando razas:', error);
      } finally {
        setRazasLoading(false);
      }
    };

    loadBreeds();
  }, [petType]);

  // 🔥 SELECCIONAR FOTO
  const handleSelectPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tus fotos para cambiar la imagen de tu mascota.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPetPhoto(result.assets[0]);
        console.log('✅ Foto seleccionada');
      }
    } catch (error) {
      console.error('❌ Error al seleccionar foto:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // 🔥 ACTUALIZAR MASCOTA
  const handleUpdatePet = async () => {
    if (!petName.trim() || !breed || !age.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        nombre: petName,
        edad: parseInt(age, 10),
        raza: breed,
      };

      if (weight.trim()) {
        updateData.peso = parseFloat(weight);
      }

      if (observations.trim()) {
        updateData.observaciones = observations;
      }

      // Si hay una foto nueva, agregarla
      if (petPhoto && !petPhoto.uri.startsWith('http')) {
        updateData.foto = petPhoto;
      }

      await updatePet(petId, updateData);

      setIsLoading(false);
      setShowSuccess(true);

    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        'Ocurrió un error al actualizar la mascota.';

      Alert.alert('Error', errorMessage);
      setIsLoading(false);
    }
  };

  const handleNotificationComplete = () => {
    console.log('📱 Volviendo a PetProfile...');
    setShowSuccess(false);
    navigation.goBack();
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
          <Text style={styles.headerTitle}>Editar Mascota</Text>

          {/* 🔥 FOTO DE PERFIL */}
          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.photoContainer}
              onPress={handleSelectPhoto}
            >
              {petPhoto ? (
                <Image source={{ uri: petPhoto.uri }} style={styles.petPhoto} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={40} color="#875686" />
                </View>
              )}
              <View style={styles.photoEditBadge}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={styles.photoHint}>Toca para cambiar la foto</Text>
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
            <Text style={styles.label}>Peso (kg) - Opcional</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 15.5"
              value={weight}
              onChangeText={setWeight}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observaciones - Opcional</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ej: Es muy activo, le gusta correr..."
              value={observations}
              onChangeText={setObservations}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          {/* BOTÓN */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isFormValid || isLoading) && styles.saveButtonDisabled
            ]}
            onPress={handleUpdatePet}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🔥 NOTIFICACIÓN DE ÉXITO */}
      {showSuccess && (
        <SuccessNotification
          message={`¡${petName} ha sido actualizado! 🐾`}
          onComplete={handleNotificationComplete}
        />
      )}
    </SafeAreaView>
  );
};

export default EditPetScreen;