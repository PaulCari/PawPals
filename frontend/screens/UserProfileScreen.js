// frontend/screens/UserProfileScreen.js

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getClientProfile } from '../services/authService';
import { getPetsByCliente } from '../services/petService';
import { styles } from '../styles/userProfileScreenStyles';

// Imágenes por defecto
const defaultUserImage = require('../assets/user.png');
const defaultDogImage = require('../assets/perro.png');
const defaultCatImage = require('../assets/gato.png');

// URL base (para desarrollo)
const API_URL = 'http://localhost:8000';

const UserProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params;

  const [profile, setProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      setLoading(false);
      return;
    }
    try {
      const [profileData, petsResponse] = await Promise.all([
        getClientProfile(clienteId),
        getPetsByCliente(clienteId)
      ]);
      setProfile(profileData);
      setPets(petsResponse.mascotas || []);
    } catch (error) {
      console.error('❌ Error al cargar perfil:', error);
      Alert.alert('Error', 'No se pudo cargar la información del perfil.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [clienteId])
  );

  const getPetDefaultImage = (especie) => {
    if (especie.toLowerCase().includes('perro')) return defaultDogImage;
    if (especie.toLowerCase().includes('gato')) return defaultCatImage;
    return defaultUserImage;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
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

      {/* --------------------------------------- */}
      {/* 🔹 HEADER CORREGIDO (Volver + Título + Carrito) */}
      {/* --------------------------------------- */}
      <View style={styles.header}>
        {/* Botón VOLVER */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Mi Perfil
        </Text>

        {/* Botón Carrito */}
        <TouchableOpacity onPress={() => navigation.navigate('Cart', { clienteId })}>
          <Ionicons name="cart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* --------------------------------------- */}
      {/* 🔹 CONTENIDO */}
      {/* --------------------------------------- */}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>

          {/* PERFIL DEL USUARIO */}
          <View style={styles.profileSection}>
            <Image
              source={
                profile?.foto
                  ? { uri: `${API_URL}/${profile.foto}` }
                  : defaultUserImage
              }
              style={styles.profilePic}
            />

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile?.nombre || 'Usuario'}</Text>
              <Text style={styles.profileContact}>{profile?.telefono || 'Sin teléfono'}</Text>
              <Text style={styles.profileContact}>{profile?.correo || 'Sin correo'}</Text>
            </View>

            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#732C71" />
            </TouchableOpacity>
          </View>

          {/* MASCOTAS */}
          <View style={styles.petsSection}>
            <Text style={styles.petsSectionTitle}>Mis Mascotas</Text>

            <View style={styles.petsList}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCard}
                  onPress={() => navigation.navigate('PetProfile', { clienteId })}
                >
                  <Image
                    source={
                      pet.foto
                        ? { uri: `${API_URL}/${pet.foto}` }
                        : getPetDefaultImage(pet.especie)
                    }
                    style={styles.petImage}
                  />
                  <Text style={styles.petName}>{pet.nombre}</Text>
                  <Text style={styles.petInfo}>{pet.raza}</Text>
                  <Text style={styles.petInfo}>{pet.edad} años</Text>
                </TouchableOpacity>
              ))}

              {/* BOTÓN PARA AGREGAR */}
              <TouchableOpacity
                style={styles.addPetCard}
                onPress={() => navigation.navigate('AddPet', { clienteId })}
              >
                <View style={styles.addPetCircle}>
                  <Ionicons name="add" size={30} color="white" />
                </View>
                <Text style={styles.addPetText}>Agregar nueva mascota</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;