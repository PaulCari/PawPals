// frontend/screens/AddAddressScreen.js

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
import * as Location from 'expo-location';

import { createAddress, updateAddress } from '../services/addressService';
import { styles } from '../styles/addAddressScreenStyles';

const AddAddressScreen = ({ navigation, route }) => {
  const { clienteId, addressId, existingAddress } = route.params || {};
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [referencia, setReferencia] = useState('');
  const [esPrincipal, setEsPrincipal] = useState(false);
  
  // Estados de ubicación
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar dirección existente si está en modo edición
  useEffect(() => {
    if (existingAddress) {
      setNombre(existingAddress.nombre || '');
      setReferencia(existingAddress.referencia || '');
      setEsPrincipal(existingAddress.es_principal || false);
      
      if (existingAddress.latitud && existingAddress.longitud) {
        setLatitud(existingAddress.latitud.toString());
        setLongitud(existingAddress.longitud.toString());
      }
    }
  }, [existingAddress]);

  // Obtener ubicación actual del usuario
  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a tu ubicación para obtener las coordenadas.'
        );
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLatitud(location.coords.latitude.toFixed(6));
      setLongitud(location.coords.longitude.toFixed(6));

      console.log('✅ Ubicación actual obtenida:', {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
      
      Alert.alert('Éxito', 'Ubicación obtenida correctamente');
    } catch (error) {
      console.error('❌ Error al obtener ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Validar formulario
  const validateForm = () => {
    if (!nombre.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un nombre para la dirección.');
      return false;
    }

    if (!latitud || !longitud) {
      Alert.alert('Ubicación requerida', 'Por favor obtén tu ubicación o ingresa coordenadas manualmente.');
      return false;
    }

    // Validar que sean números válidos
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Coordenadas inválidas', 'Por favor ingresa coordenadas válidas.');
      return false;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Coordenadas inválidas', 'Las coordenadas están fuera del rango válido.');
      return false;
    }

    return true;
  };

  // Guardar dirección
  const handleSave = async () => {
  if (!validateForm()) return;

  setSaving(true);
  try {
    const addressData = {
      nombre: nombre.trim(),
      referencia: referencia.trim(),
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      es_principal: esPrincipal,
    };

    console.log('💾 Guardando dirección:', addressData);

    let result;
    if (addressId) {
      // Actualizar dirección existente
      result = await updateAddress(addressId, addressData);
      console.log('✅ Dirección actualizada:', result);
      
      // ✅ MOSTRAR ALERTA Y VOLVER
      Alert.alert(
        '¡Éxito!',
        'Dirección actualizada correctamente',
        [
          { 
            text: 'OK', 
            onPress: () => {
              console.log('🔙 Volviendo a Checkout...');
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      // Crear nueva dirección
      result = await createAddress(clienteId, addressData);
      console.log('✅ Dirección creada:', result);
      
      // ✅ MOSTRAR ALERTA Y VOLVER
      Alert.alert(
        '¡Dirección guardada!',
        `"${addressData.nombre}" fue agregada correctamente`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              console.log('🔙 Volviendo a Checkout...');
              navigation.goBack();
            }
          }
        ]
      );
    }

  } catch (error) {
    console.error('❌ Error al guardar dirección:', error);
    
    // Extraer mensaje de error específico
    let errorMessage = 'No se pudo guardar la dirección.';
    
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    Alert.alert('Error', errorMessage);
  } finally {
    setSaving(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#875686" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {addressId ? 'Editar Dirección' : 'Agregar Dirección'}
          </Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* SECCIÓN DE UBICACIÓN */}
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            
            {/* Botón Obtener Ubicación Actual */}
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.locationButtonText}>Obteniendo ubicación...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="locate" size={24} color="white" />
                  <Text style={styles.locationButtonText}>Usar mi ubicación actual</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Inputs de Coordenadas Manuales */}
            <View style={styles.coordsInputContainer}>
              <View style={styles.coordInputGroup}>
                <Text style={styles.coordLabel}>Latitud</Text>
                <TextInput
                  style={styles.coordInput}
                  placeholder="-16.4090"
                  value={latitud}
                  onChangeText={setLatitud}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.coordInputGroup}>
                <Text style={styles.coordLabel}>Longitud</Text>
                <TextInput
                  style={styles.coordInput}
                  placeholder="-71.5375"
                  value={longitud}
                  onChangeText={setLongitud}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Información de ayuda */}
            <View style={styles.helpBox}>
              <Ionicons name="information-circle" size={20} color="#875686" />
              <Text style={styles.helpText}>
                Puedes usar tu ubicación actual o ingresar coordenadas manualmente
              </Text>
            </View>
          </View>

          {/* FORMULARIO */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Detalles de la Dirección</Text>

            {/* Nombre de la dirección */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Casa, Oficina, Casa de mis padres"
                value={nombre}
                onChangeText={setNombre}
                maxLength={60}
              />
            </View>

            {/* Referencia */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Referencia</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ej: Portón verde, al lado del parque"
                value={referencia}
                onChangeText={setReferencia}
                multiline
                numberOfLines={3}
                maxLength={100}
              />
            </View>

            {/* Dirección principal */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setEsPrincipal(!esPrincipal)}
            >
              <View style={[styles.checkbox, esPrincipal && styles.checkboxChecked]}>
                {esPrincipal && (
                  <Ionicons name="checkmark" size={18} color="white" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Establecer como dirección principal
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* BOTÓN GUARDAR */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!nombre.trim() || !latitud || !longitud || saving) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!nombre.trim() || !latitud || !longitud || saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.saveButtonText}>
                  {addressId ? 'Actualizar Dirección' : 'Guardar Dirección'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddAddressScreen;