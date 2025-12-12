// frontend/screens/UserProfileScreen.js

import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native'; // Importante para recargar al volver
import { getClienteProfile, updateClientProfile } from '../services/authService';
import { getPetsByCliente } from '../services/petService';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const UserProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  // Estado para la membresía
  const [membresia, setMembresia] = useState(null);
  
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
  });

  // ========================== CARGAR PERFIL ==========================
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [clienteId])
  );

  const loadProfileData = async () => {
    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      navigation.goBack();
      return;
    }

    try {
      // Cargamos perfil y mascotas en paralelo
      const [profileData, petsResponse] = await Promise.all([
        getClienteProfile(clienteId),
        getPetsByCliente(clienteId)
      ]);

      setFormData({
        nombre: profileData.nombre || '',
        telefono: profileData.telefono || '',
        correo: profileData.correo || '',
      });

      if (profileData.foto) {
        setProfilePhoto({ uri: profileData.foto });
      }

      // Guardamos info de la membresía
      setMembresia(profileData.membresia_activa);
      
      // Guardamos mascotas
      setPets(petsResponse.mascotas || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ========================== SELECCIONAR FOTO ==========================
  const handleSelectPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos.');
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
      Alert.alert('Campos requeridos', 'Nombre y teléfono son obligatorios.');
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
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente.');
      loadProfileData(); // Recargar para asegurar consistencia
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  // ========================== RENDER ==========================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#875686" />
      </View>
    );
  }

  // URL API para imágenes (ajusta si es necesario)
  const API_URL = 'http://localhost:8000';

  return (
    <ImageBackground source={require('../assets/FONDOA.png')} style={styles.root} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <Image 
            source={require('../assets/logo_amarillo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Cart', { clienteId })}>
            <Ionicons name="cart-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.mainContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.screenTitle}>Mi Perfil</Text>

              {/* FOTO */}
              <View style={styles.photoSection}>
                <TouchableOpacity style={styles.photoContainer} onPress={handleSelectPhoto}>
                  <Image
                    source={profilePhoto ? { uri: profilePhoto.uri.startsWith('http') ? profilePhoto.uri : profilePhoto.uri } : require('../assets/user.png')}
                    style={styles.profileImage}
                  />
                  <View style={styles.editPhotoButton}>
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* === 💎 SECCIÓN MEMBRESÍA (NUEVO) === */}
              <TouchableOpacity 
                style={[
                  styles.membershipCard, 
                  membresia?.precio > 0 ? styles.premiumBg : styles.basicBg
                ]}
                onPress={() => navigation.navigate('Subscription', { clienteId })}
              >
                <View style={styles.membershipContent}>
                  <View>
                    <Text style={styles.membershipLabel}>PLAN ACTUAL</Text>
                    <Text style={styles.membershipTitle}>
                      {membresia?.nombre || 'Básico (Gratis)'}
                    </Text>
                  </View>
                  <View style={styles.upgradeBtn}>
                    <Text style={styles.upgradeText}>
                      {membresia?.precio > 0 ? 'GESTIONAR' : 'MEJORAR'}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={MAIN_PURPLE} />
                  </View>
                </View>
              </TouchableOpacity>
              {/* ========================================= */}

              {/* FORMULARIO */}
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Teléfono</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.telefono}
                    onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo (No editable)</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={formData.correo}
                    editable={false}
                  />
                </View>
                
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  onPress={handleSaveChanges}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* LISTA RAPIDA DE MASCOTAS */}
              <View style={styles.petsPreview}>
                <Text style={styles.sectionTitle}>Mis Mascotas ({pets.length})</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('PetProfile', { clienteId })}
                  style={styles.managePetsBtn}
                >
                  <Text style={styles.managePetsText}>Gestionar Mascotas</Text>
                  <Ionicons name="paw" size={16} color="white" />
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const MAIN_PURPLE = '#732C71';
const ORANGE = '#FF8C42';
const YELLOW = '#FFD100';

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 100,
    marginTop: 20,
  },
  logo: { width: 140, height: 80 },

  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
  },
  scrollContent: { paddingBottom: 50 },

  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MAIN_PURPLE,
    paddingHorizontal: 30,
    marginBottom: 20,
  },

  photoSection: { alignItems: 'center', marginBottom: 20 },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 60 },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: ORANGE,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  // ESTILOS MEMBRESIA
  membershipCard: {
    marginHorizontal: 30,
    marginBottom: 25,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  basicBg: { backgroundColor: '#F0F0F0', borderLeftWidth: 5, borderLeftColor: '#999' },
  premiumBg: { backgroundColor: '#FFF9C4', borderLeftWidth: 5, borderLeftColor: YELLOW }, // Fondo amarillito
  
  membershipContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  membershipLabel: { fontSize: 10, fontWeight: 'bold', color: '#666', marginBottom: 2 },
  membershipTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  upgradeBtn: { 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  upgradeText: { fontSize: 12, fontWeight: 'bold', color: MAIN_PURPLE },

  // FORMULARIO
  formContainer: { paddingHorizontal: 30 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },
  inputDisabled: { backgroundColor: '#eee', color: '#888' },

  saveButton: {
    backgroundColor: MAIN_PURPLE,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // PETS PREVIEW
  petsPreview: {
    marginTop: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  managePetsBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  managePetsText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});

export default UserProfileScreen; 