import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getClienteProfile } from '../services/authService';
import { getPetsByCliente } from '../services/petService';

// Ajusta tu URL base si es necesario
const API_URL = 'http://localhost:8000';

const NutritionistScreen = ({ navigation, route }) => {
  const { clienteId } = route.params || {};
  
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [clienteId])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Obtener perfil para verificar Premium
      const profile = await getClienteProfile(clienteId);
      const hasPremium = profile.membresia_activa && parseFloat(profile.membresia_activa.precio) > 0;
      setIsPremium(hasPremium);

      // 2. Si es premium, cargamos las mascotas
      if (hasPremium) {
        const petsData = await getPetsByCliente(clienteId);
        const mascotas = petsData.mascotas || [];
        setPets(mascotas);
        
        // Seleccionar la primera por defecto
        if (mascotas.length > 0) {
          setSelectedPet(mascotas[0]);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = () => {
    if (!selectedPet) {
      Alert.alert("Atención", "Por favor selecciona una mascota para la consulta.");
      return;
    }
    // Navegar al formulario de solicitud que creamos antes
    navigation.navigate('RequestDiet', { 
      clienteId, 
      petId: selectedPet.id, 
      petName: selectedPet.nombre 
    });
  };

  // ✅ FUNCIÓN CORREGIDA PARA IMÁGENES
  const getPetImageSource = (foto) => {
    if (!foto) return require('../assets/placeholder.png');
    // Si ya tiene http, úsala tal cual. Si no, agrégale la API_URL
    const uri = foto.startsWith('http') ? foto : `${API_URL}/${foto}`;
    return { uri };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#875686" />
      </View>
    );
  }

  // === VISTA PARA USUARIOS GRATUITOS (BLOQUEADO) ===
  if (!isPremium) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground source={require('../assets/FONDOA.png')} style={styles.bg} resizeMode="cover">
          <View style={styles.container}>
            <View style={styles.lockContent}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed" size={60} color="#FF8C42" />
              </View>
              
              <Text style={styles.lockTitle}>Acceso Nutricionista</Text>
              <Text style={styles.lockSub}>
                Esta función es exclusiva para miembros Premium.
                Obtén dietas personalizadas y seguimiento profesional para tu mascota.
              </Text>

              <TouchableOpacity 
                style={styles.premiumBtn}
                onPress={() => navigation.navigate('Subscription', { clienteId })}
              >
                <Text style={styles.premiumBtnText}>HAZTE PREMIUM</Text>
                <Ionicons name="diamond" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  // === VISTA PARA USUARIOS PREMIUM (DESBLOQUEADO) ===
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/FONDOA.png')} style={styles.bg} resizeMode="cover" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consulta Nutricional</Text>
        <View style={styles.premiumBadge}>
          <Ionicons name="star" size={12} color="white" />
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.welcomeText}>
            Hola! Nuestros especialistas están listos para ayudar a tu mejor amigo.
          </Text>

          {/* SELECTOR DE MASCOTAS */}
          <Text style={styles.sectionLabel}>Selecciona tu mascota:</Text>
          
          {pets.length === 0 ? (
            <TouchableOpacity 
              style={styles.noPetsBox}
              onPress={() => navigation.navigate('AddPet', { clienteId })}
            >
              <Text style={styles.noPetsText}>No tienes mascotas registradas.{"\n"}Toca aquí para agregar una.</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
              {pets.map((pet) => (
                <TouchableOpacity 
                  key={pet.id} 
                  style={[styles.petOption, selectedPet?.id === pet.id && styles.petOptionSelected]}
                  onPress={() => setSelectedPet(pet)}
                >
                  <Image 
                    source={getPetImageSource(pet.foto)} 
                    style={[styles.petAvatar, selectedPet?.id === pet.id && styles.petAvatarSelected]} 
                  />
                  <Text style={[styles.petName, selectedPet?.id === pet.id && styles.petNameSelected]}>
                    {pet.nombre}
                  </Text>
                  {selectedPet?.id === pet.id && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* RESUMEN DE LA MASCOTA SELECCIONADA */}
          {selectedPet && (
            <View style={styles.petSummary}>
              <Text style={styles.summaryTitle}>Resumen de {selectedPet.nombre}</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Raza</Text>
                  <Text style={styles.summaryValue}>{selectedPet.raza}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Edad</Text>
                  <Text style={styles.summaryValue}>{selectedPet.edad} años</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Peso</Text>
                  <Text style={styles.summaryValue}>{selectedPet.peso || '-'} kg</Text>
                </View>
              </View>
            </View>
          )}

          {/* BOTÓN DE ACCIÓN */}
          <TouchableOpacity 
            style={[styles.actionBtn, (!selectedPet) && styles.actionBtnDisabled]}
            onPress={handleStartConsultation}
            disabled={!selectedPet}
          >
            <View style={styles.iconBox}>
              <Ionicons name="nutrition" size={24} color="#875686" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Solicitar Nueva Dieta</Text>
              <Text style={styles.actionSub}>Cuéntanos qué necesita {selectedPet?.nombre || 'tu mascota'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.infoText}>
              La respuesta del nutricionista aparecerá en el historial clínico de la mascota en 24-48 hrs.
            </Text>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#875686' },
  bg: { flex: 1, width: '100%', height: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  
  // Header
  header: { padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  premiumBadge: { flexDirection: 'row', backgroundColor: '#FFD100', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignItems: 'center', gap: 4 },
  premiumText: { fontSize: 10, fontWeight: 'bold', color: '#875686' },

  // Container
  mainContainer: { flex: 1, backgroundColor: '#F9F9F9', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollContent: { padding: 25 },

  // Welcome
  welcomeText: { fontSize: 16, color: '#666', marginBottom: 25, lineHeight: 22 },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },

  // Pets Scroll
  petsScroll: { marginBottom: 25, maxHeight: 110 },
  petOption: { alignItems: 'center', marginRight: 20, position: 'relative' },
  petAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: '#ddd' },
  petAvatarSelected: { borderColor: '#875686', borderWidth: 3 },
  petName: { marginTop: 8, fontSize: 12, color: '#666', fontWeight: '600' },
  petNameSelected: { color: '#875686', fontWeight: 'bold' },
  checkBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#875686', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },

  noPetsBox: { padding: 20, backgroundColor: '#eee', borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  noPetsText: { textAlign: 'center', color: '#666' },

  // Summary
  petSummary: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  summaryTitle: { fontSize: 14, fontWeight: 'bold', color: '#875686', marginBottom: 10, textTransform: 'uppercase' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: '#999' },
  summaryValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  // Action Button
  actionBtn: { backgroundColor: '#875686', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', shadowColor: '#875686', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, marginBottom: 20 },
  actionBtnDisabled: { backgroundColor: '#ccc', shadowOpacity: 0 },
  iconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actionTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  actionSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, width: 180 },

  // Info
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: '#e3f2fd', padding: 15, borderRadius: 15, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 12, color: '#444', lineHeight: 18 },

  // Locked State
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lockContent: { backgroundColor: 'white', padding: 30, borderRadius: 30, width: '85%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  lockTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  lockSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  premiumBtn: { backgroundColor: '#875686', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25, gap: 10 },
  premiumBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default NutritionistScreen;