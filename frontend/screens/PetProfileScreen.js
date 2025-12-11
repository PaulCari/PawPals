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
import { styles, MAIN_PURPLE } from '../styles/petProfileScreenStyles';

const PetProfileScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPets = async () => {
    if (!clienteId) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      setLoading(false);
      return;
    }
    
    try {
      console.log(`🐾 Cargando mascotas para el cliente: ${clienteId}`);
      const response = await getPetsByCliente(clienteId);
      
      if (response && response.mascotas) {
        setPets(response.mascotas);
        if (response.mascotas.length > 0) {
          setSelectedPet(response.mascotas[0]);
        } else {
          setSelectedPet(null);
        }
      } else {
        setPets([]);
        setSelectedPet(null);
      }
    } catch (error) {
      console.error('❌ Error al cargar mascotas:', error);
      Alert.alert('Error', 'No se pudieron cargar los perfiles de las mascotas.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadPets();
    }, [clienteId])
  );

  const renderPetSelector = () => (
    <View style={styles.petSelectorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pets.map(pet => (
          <TouchableOpacity 
            key={pet.id} 
            style={styles.petSelectorItem}
            onPress={() => setSelectedPet(pet)}
          >
            <View style={[
              styles.petImageWrapper,
              selectedPet?.id === pet.id && styles.petImageWrapperSelected
            ]}>
              <Image 
                source={pet.foto ? { uri: pet.foto.replace('static/', 'http://localhost:8000/static/') } : require('../assets/placeholder.png')} 
                style={styles.petImage} 
              />
            </View>
            <Text style={[
              styles.petSelectorName,
              selectedPet?.id === pet.id && styles.petSelectorNameSelected
            ]}>
              {pet.nombre}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.petSelectorItem} onPress={() => navigation.navigate('AddPet', { clienteId })}>
            <View style={styles.petImageWrapper}>
                <Ionicons name="add" size={30} color="#CCC" />
            </View>
            <Text style={styles.petSelectorName}>Agregar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw-outline" size={100} color="#ccc" />
      <Text style={styles.emptyTitle}>Aún no tienes mascotas</Text>
      <Text style={styles.emptySubtitle}>
        Registra a tu primer compañero para ver su perfil aquí.
      </Text>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddPet', { clienteId })}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>Agregar Mascota</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPetDetails = () => (
    <ScrollView>
      <View style={styles.detailCard}>
        <Image 
          source={selectedPet.foto ? { uri: selectedPet.foto.replace('static/', 'http://localhost:8000/static/') } : require('../assets/placeholder.png')}
          style={styles.mainPetImage}
        />
        <Text style={styles.petName}>{selectedPet.nombre}</Text>
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Especie</Text>
            <Text style={styles.detailValue}>{selectedPet.especie || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Raza</Text>
            <Text style={styles.detailValue}>{selectedPet.raza || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Edad</Text>
            <Text style={styles.detailValue}>{selectedPet.edad} años</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Peso</Text>
            <Text style={styles.detailValue}>{selectedPet.peso ? `${selectedPet.peso} kg` : 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.editButton}>
                <Ionicons name="create-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/FONDOA.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
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
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={MAIN_PURPLE} />
          </View>
        ) : pets.length > 0 ? (
          <View style={styles.profileContainer}>
            {renderPetSelector()}
            {selectedPet && renderPetDetails()}
          </View>
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
};

export default PetProfileScreen;