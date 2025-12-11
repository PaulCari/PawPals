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

import { getClientProfile } from '../services/authService'; // Necesitaremos esta nueva función
import { getPetsByCliente } from '../services/petService';
import { styles } from '../styles/userProfileScreenStyles';

// Imágenes por defecto locales
const defaultUserImage = require('../assets/user.png');
const defaultDogImage = require('../assets/perro.png');
const defaultCatImage = require('../assets/gato.png');

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
      // Cargar perfil y mascotas en paralelo
      const [profileData, petsResponse] = await Promise.all([
        getClientProfile(clienteId),
        getPetsByCliente(clienteId)
      ]);
      setProfile(profileData);
      setPets(petsResponse.mascotas || []);
    } catch (error) {
      console.error('❌ Error al cargar datos del perfil:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
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
    return defaultUserImage; // Una imagen genérica si no es perro o gato
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Image
          source={require('../assets/logo_amarillo.png')}
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Cart', { clienteId })}>
          <Ionicons name="cart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* SECCIÓN DEL PERFIL DE USUARIO */}
          <View style={styles.profileHeader}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Tu perfil</Text>
            </View>

            <View style={styles.profileSection}>
              <Image 
                source={profile?.foto ? { uri: profile.foto.replace('static/', 'http://localhost:8000/static/') } : defaultUserImage}
                style={styles.profilePic} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile?.nombre || 'Usuario'}</Text>
                <Text style={styles.profileContact}>{profile?.telefono || 'Sin teléfono'}</Text>
                <Text style={styles.profileContact}>{profile?.correo || 'Sin correo'}</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Editar perfil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* SECCIÓN DE MASCOTAS */}
          <View style={styles.petsSection}>
            <Text style={styles.petsSectionTitle}>Mis Mascotas</Text>
            <View style={styles.petsList}>
              {pets.map(pet => (
                <TouchableOpacity key={pet.id} style={styles.petCard} onPress={() => navigation.navigate('PetProfile', { clienteId })}>
                  <Image 
                    source={pet.foto ? { uri: pet.foto.replace('static/', 'http://localhost:8000/static/') } : getPetDefaultImage(pet.especie)}
                    style={styles.petImage}
                  />
                  <Text style={styles.petName}>{pet.nombre}</Text>
                  <Text style={styles.petInfo}>{pet.raza}</Text>
                  <Text style={styles.petInfo}>{pet.edad} años</Text>
                  <Text style={styles.petDetails}>Peso: {pet.peso || 'N/A'} Kg. Alergias: Pollo</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addPetCard} onPress={() => navigation.navigate('AddPet', { clienteId })}>
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