// frontend/screens/PetProfileScreen.js - VERSIÓN MEJORADA

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

import { getPetsByCliente, deletePet } from '../services/petService';
import { getClienteProfile } from '../services/authService';
import { styles } from '../styles/userProfileScreenStyles';

const PetProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [userProfile, setUserProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 🔥 FUNCIÓN MEJORADA PARA ELIMINAR MASCOTA
  const handleDeletePet = (petId, petName) => {
    Alert.alert(
      "Eliminar Mascota",
      `¿Estás seguro de que deseas eliminar a ${petName}?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              console.log('🗑️ Eliminando mascota:', petId);
              
              // Mostrar loading
              setLoading(true);
              
              // Llamar al servicio
              await deletePet(petId);
              
              console.log('✅ Mascota eliminada del backend');
              
              // Recargar datos
              await loadData();
              
              Alert.alert(
                "¡Eliminado!",
                `${petName} ha sido eliminado de tu perfil.`
              );
            } catch (error) {
              console.error('❌ Error al eliminar mascota:', error);
              
              const errorMessage = error.response?.data?.detail 
                || error.message 
                || 'No se pudo eliminar la mascota.';
              
              Alert.alert('Error', errorMessage);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // 🔥 FUNCIÓN PARA EDITAR MASCOTA
  const handleEditPet = (pet) => {
    navigation.navigate('EditPet', { 
      clienteId, 
      petId: pet.id,
      existingPet: pet 
    });
  };

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
                      ? { uri: userProfile.foto }
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

              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => navigation.navigate('UserProfile', { clienteId })} // Esto navega a UserProfileScreen
              >
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

              
          <TouchableOpacity
            style={styles.customOrderButton}
            onPress={() => navigation.navigate('CustomOrder', { clienteId })}
          >
            <Ionicons name="restaurant" size={24} color="white" />
            <Text style={styles.customOrderButtonText}>
              Solicitar Plan Nutricional Personalizado
            </Text>
          </TouchableOpacity>


            <View style={styles.petsList}>
              {pets.map(pet => (
                <View key={pet.id} style={styles.petCard}>
                  <TouchableOpacity 
                    style={styles.petCardImageContainer}
                    onPress={() => {
                      // Aquí podrías navegar a un detalle de mascota
                      console.log('Ver detalle de:', pet.nombre);
                    }}
                  >
                    <Image
                      source={
                        pet.foto 
                          ? { uri: pet.foto }
                          : require('../assets/placeholder.png')
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
                  </TouchableOpacity>

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
                        Sin alergias
                      </Text>
                    </View>
                  </View>

                  {/* 🔥 BOTONES DE ACCIÓN MEJORADOS */}
                  <View style={styles.petCardActions}>
                    <TouchableOpacity 
                      style={styles.editPetButton}
                      onPress={() => handleEditPet(pet)}
                    >
                      <Ionicons name="create-outline" size={18} color="#875686" />
                      <Text style={styles.editPetText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.deletePetButton}
                      onPress={() => handleDeletePet(pet.id, pet.nombre)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                      <Text style={styles.deletePetText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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