// frontend/screens/UserProfileScreen.js - VERSIÓN CORREGIDA

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getClienteProfile, updateClientProfile } from '../services/authService';

const UserProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  // Estados
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
  });

  // Cargar datos del perfil
  useEffect(() => {
    loadProfileData();
  }, [clienteId]);

  const loadProfileData = async () => {
    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      console.log('📥 Cargando perfil para cliente:', clienteId);
      
      const data = await getClienteProfile(clienteId);
      console.log('✅ Datos recibidos:', data);

      // Actualizar estado del formulario
      setFormData({
        nombre: data.nombre || '',
        telefono: data.telefono || '',
        correo: data.correo || '',
      });

      // Configurar foto de perfil
      if (data.foto) {
        setProfilePhoto({ uri: data.foto });
      }

    } catch (error) {
      console.error('❌ Error al cargar perfil:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar foto de perfil
  const handleSelectPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tus fotos para cambiar tu imagen de perfil.'
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
        setProfilePhoto(result.assets[0]);
        console.log('📸 Nueva foto seleccionada');
      }
    } catch (error) {
      console.error('❌ Error al seleccionar foto:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // Guardar cambios
  const handleSaveChanges = async () => {
    // Validaciones
    if (!formData.nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre no puede estar vacío.');
      return;
    }

    if (!formData.telefono.trim()) {
      Alert.alert('Campo requerido', 'El teléfono no puede estar vacío.');
      return;
    }

    // Validar formato de teléfono (básico)
    if (formData.telefono.length < 9) {
      Alert.alert('Teléfono inválido', 'Ingresa un número de teléfono válido.');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Guardando cambios...');

      // Preparar datos para enviar
      const updateData = {
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.trim(),
      };

      // Agregar foto si se seleccionó una nueva
      let photoToSend = null;
      if (profilePhoto && !profilePhoto.uri.startsWith('http')) {
        photoToSend = profilePhoto;
      }

      console.log('📤 Enviando actualización:', updateData);

      const response = await updateClientProfile(clienteId, updateData, photoToSend);

      console.log('✅ Perfil actualizado:', response);

      Alert.alert(
        '¡Éxito!',
        'Tu perfil ha sido actualizado correctamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Recargar datos actualizados
              loadProfileData();
            }
          }
        ]
      );

    } catch (error) {
      console.error('❌ Error al guardar:', error);
      
      const errorMessage = error.response?.data?.detail 
        || error.message 
        || 'No se pudieron guardar los cambios.';
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#875686" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

          <Text style={styles.headerTitle}>Mi Perfil</Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* FOTO DE PERFIL */}
          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.photoContainer}
              onPress={handleSelectPhoto}
            >
              <Image
                source={
                  profilePhoto
                    ? { uri: profilePhoto.uri }
                    : require('../assets/user.png')
                }
                style={styles.profileImage}
              />
              <View style={styles.editPhotoButton}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={styles.photoHint}>Toca para cambiar la foto</Text>
          </View>

          {/* FORMULARIO */}
          <View style={styles.formContainer}>
            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nombre completo <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                placeholder="Ej: Juan Pérez"
                placeholderTextColor="#999"
              />
            </View>

            {/* Teléfono */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Teléfono <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                placeholder="Ej: 987654321"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            {/* Correo (no editable) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={formData.correo}
                editable={false}
                placeholderTextColor="#999"
              />
              <Text style={styles.hint}>
                El correo no puede ser modificado
              </Text>
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                saving && styles.saveButtonDisabled
              ]}
              onPress={handleSaveChanges}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  container: {
    flex: 1,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#732C71',
  },

  // === LOADING ===
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },

  // === SCROLL CONTENT ===
  scrollContent: {
    paddingBottom: 40,
  },

  // === FOTO DE PERFIL ===
  photoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    marginBottom: 2,
  },

  photoContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  editPhotoButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FF8C42',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },

  photoHint: {
    marginTop: 15,
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },

  // === FORMULARIO ===
  formContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  required: {
    color: '#FF6B6B',
  },

  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },

  inputDisabled: {
    backgroundColor: '#EFEFEF',
    color: '#999',
  },

  hint: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    fontStyle: 'italic',
  },

  // === BOTÓN GUARDAR ===
  saveButton: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#FF8C42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default UserProfileScreen;