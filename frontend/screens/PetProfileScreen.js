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
  ImageBackground,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getPetsByCliente, deletePet, getPetDetail } from '../services/petService';
import { getClienteProfile } from '../services/authService';
import { addToCart } from '../services/cartService';
import { styles } from '../styles/userProfileScreenStyles';

// Estilos extra para la tarjeta de dieta
const extraStyles = StyleSheet.create({
  dietCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFD100',
    width: '100%',
  },
  dietHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dietTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#875686',
    marginLeft: 8,
    flex: 1,
  },
  dietName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dietDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  dietFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  dietPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#732C71',
  },
  buyButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // 🔥 NUEVO ESTILO PARA EL BOTÓN DE EDITAR PERFIL
  editProfileBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(135, 86, 134, 0.1)', // Un morado muy suave
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  }
});

const PetProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [userProfile, setUserProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [petMenus, setPetMenus] = useState({}); 

  const getPetIcon = (especie) => {
    const especieLower = especie?.toLowerCase() || '';
    if (especieLower.includes('perro')) return 'paw';
    if (especieLower.includes('gato')) return 'paw';
    return 'heart';
  };

  const loadData = async () => {
    if (!clienteId) return;
    
    try {
      setLoading(true);
      // 1. Cargar Perfil y Mascotas
      const [profileData, petsResponse] = await Promise.all([
        getClienteProfile(clienteId),
        getPetsByCliente(clienteId)
      ]);
      
      setUserProfile(profileData);
      const mascotas = petsResponse.mascotas || [];
      setPets(mascotas);

      // 2. Cargar Menús Personalizados
      const menusMap = {};
      for (const pet of mascotas) {
        try {
          const detail = await getPetDetail(pet.id);
          if (detail.menus_personalizados && detail.menus_personalizados.length > 0) {
            menusMap[pet.id] = detail.menus_personalizados;
          }
        } catch (err) {
          console.log(`No se pudo cargar detalle para ${pet.nombre}`);
        }
      }
      setPetMenus(menusMap);

    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [clienteId])
  );

  const handleBuyDiet = async (menu) => {
    try {
      await addToCart(clienteId, menu, 1);
      Alert.alert(
        "¡Agregado!",
        `El menú "${menu.nombre}" está en tu carrito.`,
        [
          { text: "Seguir viendo", style: "cancel" },
          { text: "Ir al Carrito", onPress: () => navigation.navigate('Cart', { clienteId }) }
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo agregar al carrito.");
    }
  };

  const handleDeletePet = (petId, petName) => {
    Alert.alert(
      "Eliminar Mascota",
      `¿Eliminar a ${petName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoading(true);
              await deletePet(petId);
              loadData(); 
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground source={require('../assets/FONDOA.png')} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/FONDOA.png')} style={styles.backgroundImage} resizeMode="cover" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Image source={require('../assets/logo_amarillo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('Cart', { clienteId })}>
          <Ionicons name="cart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          
          {/* USER INFO CON BOTÓN DE EDITAR */}
          {userProfile && (
            <View style={styles.userInfoSection}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={userProfile.foto ? { uri: userProfile.foto } : require('../assets/user.png')}
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.userName}>{userProfile.nombre}</Text>
              
              {/* 🔥 BOTÓN PARA EDITAR PERFIL AGREGADO AQUÍ */}
              <TouchableOpacity 
                style={extraStyles.editProfileBtn}
                onPress={() => navigation.navigate('UserProfile', { clienteId })}
              >
                <Ionicons name="create-outline" size={18} color="#875686" />
                <Text style={{ marginLeft: 5, color: '#875686', fontWeight: 'bold' }}>
                  Editar Perfil
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* LISTA DE MASCOTAS */}
          <View style={styles.petsSection}>
            <Text style={styles.petsSectionTitle}>Mis Mascotas</Text>

            <View style={styles.petsList}>
              {pets.map(pet => (
                <View key={pet.id} style={[styles.petCard, { width: '100%', marginBottom: 20 }]}> 
                  
                  <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                    <Image
                        source={pet.foto ? { uri: pet.foto } : require('../assets/placeholder.png')}
                        style={styles.petCardImage}
                    />
                    <View style={{marginLeft: 15, flex: 1}}>
                        <Text style={styles.petCardName}>{pet.nombre}</Text>
                        <Text style={styles.petCardInfo}>{pet.raza} • {pet.edad} años</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('EditPet', { clienteId, petId: pet.id, existingPet: pet })}>
                        <Ionicons name="create-outline" size={24} color="#875686" />
                    </TouchableOpacity>
                  </View>

                  {/* SECCIÓN DIETA PERSONALIZADA */}
                  {petMenus[pet.id] && petMenus[pet.id].length > 0 && (
                    <View style={extraStyles.dietCard}>
                      <View style={extraStyles.dietHeader}>
                        <Ionicons name="restaurant" size={16} color="#FF8C42" />
                        <Text style={extraStyles.dietTitle}>DIETA PERSONALIZADA DISPONIBLE</Text>
                      </View>
                      
                      <Text style={extraStyles.dietName}>{petMenus[pet.id][0].nombre}</Text>
                      <Text style={extraStyles.dietDesc} numberOfLines={2}>
                        {petMenus[pet.id][0].descripcion}
                      </Text>
                      
                      <View style={extraStyles.dietFooter}>
                        <Text style={extraStyles.dietPrice}>S/ {petMenus[pet.id][0].precio.toFixed(2)}</Text>
                        <TouchableOpacity 
                          style={extraStyles.buyButton}
                          onPress={() => handleBuyDiet(petMenus[pet.id][0])}
                        >
                          <Ionicons name="cart" size={16} color="white" />
                          <Text style={extraStyles.buyButtonText}>COMPRAR</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                </View>
              ))}

              <TouchableOpacity style={styles.addPetCard} onPress={() => navigation.navigate('AddPet', { clienteId })}>
                <Ionicons name="add-circle" size={40} color="#732C71" />
                <Text style={styles.addPetText}>Agregar mascota</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PetProfileScreen;