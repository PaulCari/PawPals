// frontend/screens/CustomOrderScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { createCustomOrder } from '../services/customOrderService';
import { getPetsByCliente } from '../services/petService';
import { styles } from '../styles/customOrderScreenStyles';

const CustomOrderScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  // Estados principales
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [step, setStep] = useState(1); // 1: Seleccionar mascota, 2: Formulario

  // Datos del pedido
  const [orderData, setOrderData] = useState({
    frecuencia: '',
    objetivo_dieta: '',
    indicaciones: '',
    consulta_nutricionista: false,
  });

  // Alergias y condiciones
  const [alergias, setAlergias] = useState('');
  const [condiciones, setCondiciones] = useState('');
  const [preferencias, setPreferencias] = useState('');

  // Archivos
  const [recetaMedica, setRecetaMedica] = useState(null);
  const [archivoAdicional, setArchivoAdicional] = useState(null);

  // Cargar mascotas al iniciar
  useEffect(() => {
    loadPets();
  }, [clienteId]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const response = await getPetsByCliente(clienteId);
      setPets(response.mascotas || []);
    } catch (error) {
      console.error('❌ Error cargando mascotas:', error);
      Alert.alert('Error', 'No se pudieron cargar tus mascotas.');
    } finally {
      setLoading(false);
    }
  };

  // 📎 Seleccionar archivo (receta médica o adicional)
  const handleSelectFile = async (type) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tus archivos para adjuntar documentos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (type === 'receta') {
          setRecetaMedica(result.assets[0]);
          console.log('📄 Receta médica seleccionada');
        } else {
          setArchivoAdicional(result.assets[0]);
          console.log('📎 Archivo adicional seleccionado');
        }
      }
    } catch (error) {
      console.error('❌ Error al seleccionar archivo:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo.');
    }
  };

  // ✅ Enviar pedido personalizado
  const handleSubmitOrder = async () => {
    // Validaciones
    if (!selectedPet) {
      Alert.alert('Mascota requerida', 'Por favor selecciona una mascota.');
      return;
    }

    if (!orderData.frecuencia.trim() || !orderData.objetivo_dieta.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa la frecuencia y el objetivo de la dieta.');
      return;
    }

    setLoading(true);

    try {
      console.log('📦 Enviando pedido personalizado...');

      const customOrderData = {
        registro_mascota_id: selectedPet.id,
        frecuencia_cantidad: orderData.frecuencia,
        objetivo_dieta: orderData.objetivo_dieta,
        indicaciones_adicionales: orderData.indicaciones || '',
        consulta_nutricionista: orderData.consulta_nutricionista,
        descripcion_alergias: alergias || '',
        condiciones_salud: condiciones || '',
        preferencias_alimentarias: preferencias || '',
        receta_medica: recetaMedica,
        archivo_adicional: archivoAdicional,
      };

      const response = await createCustomOrder(clienteId, customOrderData);

      console.log('✅ Pedido creado exitosamente:', response);

      Alert.alert(
        '¡Pedido Enviado!',
        'Tu pedido personalizado ha sido enviado. Un nutricionista lo revisará pronto.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      const errorMessage = error.response?.data?.detail || 'No se pudo enviar el pedido.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 📱 RENDERIZADO
  if (loading && pets.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#875686" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      {/* CONTENIDO */}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>Pedido Personalizado</Text>

          {/* PASO 1: SELECCIONAR MASCOTA */}
          {step === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selecciona tu mascota</Text>

              {pets.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="paw" size={60} color="#ccc" />
                  <Text style={styles.emptyText}>No tienes mascotas registradas</Text>
                  <TouchableOpacity
                    style={styles.addPetButton}
                    onPress={() => navigation.navigate('AddPet', { clienteId })}
                  >
                    <Text style={styles.addPetButtonText}>Agregar Mascota</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.petsList}>
                  {pets.map((pet) => (
                    <TouchableOpacity
                      key={pet.id}
                      style={[
                        styles.petCard,
                        selectedPet?.id === pet.id && styles.petCardSelected,
                      ]}
                      onPress={() => {
                        setSelectedPet(pet);
                        setStep(2);
                      }}
                    >
                      <Image
                        source={
                          pet.foto
                            ? { uri: pet.foto }
                            : require('../assets/placeholder.png')
                        }
                        style={styles.petImage}
                      />
                      <Text style={styles.petName}>{pet.nombre}</Text>
                      <Text style={styles.petInfo}>{pet.especie} • {pet.edad} años</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* PASO 2: FORMULARIO DEL PEDIDO */}
          {step === 2 && selectedPet && (
            <>
              {/* Mascota seleccionada */}
              <View style={styles.selectedPetBanner}>
                <Image
                  source={
                    selectedPet.foto
                      ? { uri: selectedPet.foto }
                      : require('../assets/placeholder.png')
                  }
                  style={styles.selectedPetImage}
                />
                <View style={styles.selectedPetInfo}>
                  <Text style={styles.selectedPetName}>{selectedPet.nombre}</Text>
                  <Text style={styles.selectedPetDetails}>
                    {selectedPet.especie} • {selectedPet.raza}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setStep(1)}>
                  <Ionicons name="create-outline" size={24} color="#875686" />
                </TouchableOpacity>
              </View>

              {/* Frecuencia */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frecuencia de alimentación *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 2 veces al día"
                  value={orderData.frecuencia}
                  onChangeText={(text) =>
                    setOrderData({ ...orderData, frecuencia: text })
                  }
                  placeholderTextColor="#999"
                />
              </View>

              {/* Objetivo de la dieta */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Objetivo de la dieta *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ej: Control de peso, problemas digestivos, etc."
                  value={orderData.objetivo_dieta}
                  onChangeText={(text) =>
                    setOrderData({ ...orderData, objetivo_dieta: text })
                  }
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Indicaciones adicionales */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Indicaciones adicionales</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Cualquier detalle relevante..."
                  value={orderData.indicaciones}
                  onChangeText={(text) =>
                    setOrderData({ ...orderData, indicaciones: text })
                  }
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Alergias */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alergias conocidas</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Pollo, lácteos"
                  value={alergias}
                  onChangeText={setAlergias}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Condiciones de salud */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Condiciones de salud</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Diabetes, problemas renales"
                  value={condiciones}
                  onChangeText={setCondiciones}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Preferencias alimentarias */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preferencias alimentarias</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Comida húmeda, sin granos"
                  value={preferencias}
                  onChangeText={setPreferencias}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Checkbox: Consulta con nutricionista */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setOrderData({
                    ...orderData,
                    consulta_nutricionista: !orderData.consulta_nutricionista,
                  })
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    orderData.consulta_nutricionista && styles.checkboxChecked,
                  ]}
                >
                  {orderData.consulta_nutricionista && (
                    <Ionicons name="checkmark" size={18} color="white" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Solicitar consulta con nutricionista
                </Text>
              </TouchableOpacity>

              {/* Receta médica */}
              <View style={styles.fileSection}>
                <Text style={styles.label}>Receta médica (opcional)</Text>
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={() => handleSelectFile('receta')}
                >
                  <Ionicons name="document-text-outline" size={24} color="#875686" />
                  <Text style={styles.fileButtonText}>
                    {recetaMedica ? 'Cambiar archivo' : 'Adjuntar receta'}
                  </Text>
                </TouchableOpacity>
                {recetaMedica && (
                  <Text style={styles.fileName}>{recetaMedica.fileName || 'Archivo seleccionado'}</Text>
                )}
              </View>

              {/* Archivo adicional */}
              <View style={styles.fileSection}>
                <Text style={styles.label}>Archivo adicional (opcional)</Text>
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={() => handleSelectFile('adicional')}
                >
                  <Ionicons name="attach" size={24} color="#875686" />
                  <Text style={styles.fileButtonText}>
                    {archivoAdicional ? 'Cambiar archivo' : 'Adjuntar archivo'}
                  </Text>
                </TouchableOpacity>
                {archivoAdicional && (
                  <Text style={styles.fileName}>{archivoAdicional.fileName || 'Archivo seleccionado'}</Text>
                )}
              </View>

              {/* Botón enviar */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitOrder}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="send" size={24} color="white" />
                    <Text style={styles.submitButtonText}>Enviar Pedido</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CustomOrderScreen;