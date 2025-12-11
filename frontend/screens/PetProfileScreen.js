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
import { styles } from '../styles/userProfileScreenStyles'; // <-- CAMBIO DE ESTILOS

const PetProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [userProfile, setUserProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga todos los datos (perfil y mascotas)
  const loadData = async () => {
    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Carga en paralelo para más eficiencia
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

  const getPetDefaultImage = (especie) => {
    if (especie?.toLowerCase().includes('perro')) {
      return require('../assets/perro.png');
    }
    if (especie?.toLowerCase().includes('gato')) {
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
          {/* --- Profile Header --- */}
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tu perfil</Text>
          </View>

          {/* --- User Info --- */}
          {userProfile && (
            <View style={styles.userInfoSection}>
              <Image 
                source={userProfile.foto ? { uri: userProfile.foto.replace('static/', 'http://localhost:8000/static/') } : require('../assets/user.png')}
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

          {/* --- Mascotas Section --- */}
          <View style={styles.petsSection}>
            <Text style={styles.petsSectionTitle}>Mis Mascotas</Text>
            <View style={styles.petsList}>
              {pets.map(pet => (
                <TouchableOpacity key={pet.id} style={styles.petCard} onPress={() => navigation.navigate(/* A la pantalla de detalle de UNA mascota */)}>
                  <Image
                    source={pet.foto ? { uri: pet.foto.replace('static/', 'http://localhost:8000/static/') } : getPetDefaultImage(pet.especie)}
                    style={styles.petCardImage}
                  />
                  <Text style={styles.petCardName}>{pet.nombre}</Text>
                  <Text style={styles.petCardInfo}>{pet.raza}</Text>
                  <Text style={styles.petCardInfo}>{pet.edad} años</Text>
                  <View style={styles.petCardDetails}>
                    <Text style={styles.petCardDetailText}>Peso: {pet.peso ? `${pet.peso} Kg.` : 'N/A'}</Text>
                    <Text style={styles.petCardDetailText}>Alergias: Pollo</Text>
                  </View>
                </TouchableOpacity>
              ))}
              
              {/* Add Pet Card */}
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