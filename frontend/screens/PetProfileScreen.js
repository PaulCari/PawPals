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
import api from '../services/api';

const PetProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [userProfile, setUserProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FUNCIÓN PARA CONSTRUIR URL DE IMÁGENES
  const getImageUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.startsWith('static/') ? path.substring(7) : path;
    return `${api.defaults.baseURL}/static/${cleanPath}`;
  };
  
  // 🔥 FUNCIÓN PARA IMAGEN POR DEFECTO SEGÚN ESPECIE
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

  // 🔥 FUNCIÓN PARA OBTENER ÍCONO SEGÚN ESPECIE
  const getPetIcon = (especie) => {
    const especieLower = especie?.toLowerCase() || '';
    if (especieLower.includes('perro')) return 'paw';
    if (especieLower.includes('gato')) return 'paw';
    return 'heart';
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground 
          source={require('../assets/FONDOA.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover" 
        />
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

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
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

      {/* CONTENEDOR BLANCO */}
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          
          {/* 🔥 PERFIL DEL USUARIO MEJORADO */}
          {userProfile && (
            <View style={styles.userInfoSection}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={
                    userProfile.foto 
                      ? { uri: getImageUrl(userProfile.foto) } 
                      : require('../assets/user.png')
                  }
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editProfileIconButton}>
                  <Ionicons name="camera" size={20} color="#732C71" />
                </TouchableOpacity>
              </View>

              <Text style={styles.userName}>{userProfile.nombre}</Text>
              <Text style={styles.userInfoText}>
                <Ionicons name="call" size={14} color="#888" /> {userProfile.telefono || 'Sin teléfono'}
              </Text>
              <Text style={styles.userInfoText}>
                <Ionicons name="mail" size={14} color="#888" /> {userProfile.correo || 'Sin correo'}
              </Text>

              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileButtonText}>Editar perfil</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 🔥 SECCIÓN DE MASCOTAS MEJORADA */}
          <View style={styles.petsSection}>
            <View style={styles.petsSectionHeader}>
              <Text style={styles.petsSectionTitle}>Mis Mascotas</Text>
              {pets.length > 0 && (
                <View style={styles.petsCount}>
                  <Text style={styles.petsCountText}>{pets.length}</Text>
                </View>
              )}
            </View>

            <View style={styles.petsList}>
              {pets.map(pet => (
                <TouchableOpacity key={pet.id} style={styles.petCard}>
                  <View style={styles.petCardImageContainer}>
                    <Image
                      source={
                        pet.foto 
                          ? { uri: getImageUrl(pet.foto) } 
                          : getPetDefaultImage(pet.especie)
                      }
                      style={styles.petCardImage}
                    />
                    <View style={styles.petCardBadge}>
                      <Ionicons 
                        name={getPetIcon(pet.especie)} 
                        size={16} 
                        color="#732C71" 
                      />
                    </View>
                  </View>

                  <Text style={styles.petCardName}>{pet.nombre}</Text>
                  <Text style={styles.petCardInfo}>{pet.raza}</Text>
                  <Text style={styles.petCardInfo}>{pet.edad} años</Text>

                  <View style={styles.petCardDetails}>
                    {pet.peso && (
                      <View style={styles.petCardDetailRow}>
                        <Ionicons name="fitness" size={14} color="#888" />
                        <Text style={styles.petCardDetailText}>
                          {pet.peso} Kg
                        </Text>
                      </View>
                    )}
                    <View style={styles.petCardDetailRow}>
                      <Ionicons name="medical" size={14} color="#888" />
                      <Text style={styles.petCardDetailText}>
                        Alergias: Pollo
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {/* 🔥 BOTÓN AGREGAR MEJORADO */}
              <TouchableOpacity 
                style={styles.addPetCard} 
                onPress={() => navigation.navigate('AddPet', { clienteId })}
              >
                <View style={styles.addPetCircle}>
                  <Ionicons name="add" size={40} color="white" />
                </View>
                <Text style={styles.addPetText}>
                  Agregar nueva{'\n'}mascota
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PetProfileScreen;