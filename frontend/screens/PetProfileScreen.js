// frontend/screens/PetProfileScreen.js

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
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getPetsByCliente } from '../services/petService';
import { getClienteProfile } from '../services/authService';
import { styles } from '../styles/userProfileScreenStyles';
import api from '../services/api'; // Importamos la configuración de la API

const PetProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [userProfile, setUserProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN CORREGIDA PARA CONSTRUIR URL DEL BACKEND ---
  const getImageUrl = (path) => {
    if (!path) return null;
    // Remueve 'static/' si viene del backend y construye la URL completa
    const cleanPath = path.startsWith('static/') ? path.substring(7) : path;
    return `${api.defaults.baseURL}/static/${cleanPath}`;
  };
  
  const loadData = async () => {
    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const [profileData, petsResponse] = await Promise.all([
        getClienteProfile(clienteId),
        getPetsByCliente(clienteId)
      ]);
      
      setUserProfile(profileData);
      setPets(petsResponse.mascotas || []);

    } catch (error) {
      console.error('❌ Error al cargar datos del perfil:', error);
      Alert.alert('Error', 'No se pudieron cargar tus datos.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [clienteId])
  );

  // --- FUNCIÓN CORREGIDA PARA IMÁGENES LOCALES POR DEFECTO ---
  const getPetDefaultImage = (especie) => {
    const especieLower = especie?.toLowerCase() || '';
    if (especieLower.includes('perro')) {
      return require('../assets/perro.png');
    }
    if (especieLower.includes('gato')) {
      return require('../assets/gato.png');
    }
    return require('../assets/placeholder.png');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
         <ImageBackground source={require('../assets/FONDOA.png')} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FFF" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/FONDOA.png')} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu" size={30} color="white" /></TouchableOpacity>
        <Image source={require('../assets/logo_amarillo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('Cart', { clienteId })}><Ionicons name="cart-outline" size={30} color="white" /></TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tu perfil</Text>
          </View>

          {userProfile && (
            <View style={styles.userInfoSection}>
              {/* --- LÓGICA DE IMAGEN CORREGIDA PARA USUARIO --- */}
              <Image 
                source={userProfile.foto ? { uri: getImageUrl(userProfile.foto) } : require('../assets/user.png')}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{userProfile.nombre}</Text>
              <Text style={styles.userInfoText}>{userProfile.telefono}</Text>
              <Text style={styles.userInfoText}>{userProfile.correo}</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileButtonText}>Editar perfil</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.petsSection}>
            <Text style={styles.petsSectionTitle}>Mis Mascotas</Text>
            <View style={styles.petsList}>
              {pets.map(pet => (
                <TouchableOpacity key={pet.id} style={styles.petCard}>
                  {/* --- LÓGICA DE IMAGEN CORREGIDA PARA MASCOTAS --- */}
                  <Image
                    source={pet.foto ? { uri: getImageUrl(pet.foto) } : getPetDefaultImage(pet.especie)}
                    style={styles.petCardImage}
                  />
                  <Text style={styles.petCardName}>{pet.nombre}</Text>
                  <Text style={styles.petCardInfo}>{pet.raza}</Text>
                  <Text style={styles.petCardInfo}>{pet.edad} años</Text>
                  <View style={styles.petCardDetails}>
                    <Text style={styles.petCardDetailText}>Peso: {pet.peso ? `${pet.peso} Kg.` : 'N/A'}</Text>
                    {/* Este dato de alergias es estático por ahora, se deberá obtener del backend en el futuro */}
                    <Text style={styles.petCardDetailText}>Alergias: Pollo</Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.addPetCard} onPress={() => navigation.navigate('AddPet', { clienteId })}>
                <View style={styles.addPetCircle}>
                  <Ionicons name="add" size={40} color="white" />
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

export default PetProfileScreen;