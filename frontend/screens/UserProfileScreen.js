// frontend/screens/UserProfileScreen.js - VERSIÓN FINAL CORREGIDA (2)

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
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getClienteProfile, updateClientProfile } from '../services/authService';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const UserProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
  });

  // ========================== CARGAR PERFIL ==========================
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
      const data = await getClienteProfile(clienteId);

      setFormData({
        nombre: data.nombre || '',
        telefono: data.telefono || '',
        correo: data.correo || '',
      });

      if (data.foto) {
        setProfilePhoto({ uri: data.foto });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
    } finally {
      setLoading(false);
    }
  };

  // ========================== SELECCIONAR FOTO ==========================
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

      if (result.canceled) return;

      const original = result.assets[0].uri;

      // Comprimir
      const manipulated = await manipulateAsync(
        original,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      setProfilePhoto({
        uri: manipulated.uri,
        type: 'image/jpeg',
        name: `profile_${Date.now()}.jpg`,
      });

    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // ========================== GUARDAR ==========================
  const handleSaveChanges = async () => {
    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      Alert.alert('Campos requeridos', 'El nombre y el teléfono no pueden estar vacíos.');
      return;
    }
    if (formData.telefono.length < 9) {
      Alert.alert('Teléfono inválido', 'Ingresa un número de teléfono válido.');
      return;
    }

    try {
      setSaving(true);
      const updateData = {
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.trim(),
      };
      let photoToSend = null;
      if (profilePhoto && !profilePhoto.uri.startsWith('http')) {
        photoToSend = profilePhoto;
      }
      await updateClientProfile(clienteId, updateData, photoToSend);
      Alert.alert('¡Éxito!', 'Tu perfil ha sido actualizado correctamente.', [
        { text: 'OK', onPress: () => loadProfileData() }
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'No se pudieron guardar los cambios.';
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ========================== LOADING ==========================
  if (loading) {
    return (
      <ImageBackground source={require('../assets/FONDOA.png')} style={styles.root} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Cargando perfil...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // ========================== UI ==========================
  return (
    <ImageBackground source={require('../assets/FONDOA.png')} style={styles.root} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        
        {/* === HEADER AL ESTILO HOME === */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={32} color="white" />
          </TouchableOpacity>
          <Image 
            source={require('../assets/logo_amarillo.png')} // <-- CAMBIA ESTO POR EL NOMBRE DE TU LOGO
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* === CONTENEDOR PRINCIPAL BLANCO === */}
          <View style={styles.mainContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* TÍTULO DENTRO DEL CONTENEDOR */}
              <Text style={styles.screenTitle}>Mi Perfil</Text>

              {/* FOTO */}
              <View style={styles.photoSection}>
                <TouchableOpacity style={styles.photoContainer} onPress={handleSelectPhoto}>
                  <Image
                    source={profilePhoto ? { uri: profilePhoto.uri } : require('../assets/user.png')}
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
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre completo <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={styles.input}
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                    placeholder="Ej: Juan Pérez"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
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
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={formData.correo}
                    editable={false}
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.hint}>El correo no puede ser modificado</Text>
                </View>
                
                {/* BOTÓN GUARDAR */}
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
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
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

// ========================== ESTILOS ==========================
const MAIN_PURPLE = '#732C71'; // Un morado más oscuro para el texto del título
const LIGHT_BACKGROUND = '#FFFFFF';
const ORANGE = '#FF8C42';

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 140, // Altura del área morada superior
  },
  logo: {
    width: 160,
    height: 120,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    paddingTop: 30,
  },
  scrollContent: { paddingBottom: 40 },

  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MAIN_PURPLE,
    paddingHorizontal: 30,
    paddingTop: 30,
    marginBottom: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  photoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    backgroundColor: '#E0E0E0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: ORANGE,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  photoHint: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },

  formContainer: {
    paddingHorizontal: 30,
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
  required: { color: '#FF5A5A' },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#E9E9E9',
    color: '#888',
  },
  hint: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    fontStyle: 'italic',
  },

  saveButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 15,
    elevation: 4,
    shadowColor: ORANGE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default UserProfileScreen;