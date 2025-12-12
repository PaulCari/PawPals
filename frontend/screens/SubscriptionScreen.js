import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api'; // Asegúrate que apunte a tu backend

const SubscriptionScreen = ({ navigation, route }) => {
  const { clienteId } = route.params;
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      const res = await api.get('/cliente/subscripciones/');
      setPlanes(res.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar los planes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      // Usamos FormData porque el backend espera Form(...)
      const formData = new FormData();
      formData.append('plan_id', plan.id);

      await api.post(`/cliente/subscripciones/${clienteId}/suscribirse`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Alert.alert(
        "¡Bienvenido a Premium! 🌟",
        "Ahora tienes acceso ilimitado a nuestros nutricionistas.",
        [{ text: "Entendido", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la suscripción.");
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#875686"/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Elige tu Plan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Ionicons name="diamond" size={60} color="#FFD100" />
          <Text style={styles.heroTitle}>Mejora la salud de tu mascota</Text>
          <Text style={styles.heroSub}>Accede a dietas personalizadas por expertos.</Text>
        </View>

        {planes.map((plan) => (
          <View key={plan.id} style={[styles.card, plan.precio > 0 ? styles.premiumCard : styles.basicCard]}>
            {plan.precio > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>RECOMENDADO</Text>
              </View>
            )}
            
            <Text style={[styles.planName, plan.precio > 0 ? {color:'white'} : {color:'#333'}]}>
              {plan.nombre}
            </Text>
            
            <Text style={[styles.price, plan.precio > 0 ? {color:'white'} : {color:'#875686'}]}>
              {plan.precio === 0 ? 'GRATIS' : `S/ ${plan.precio.toFixed(2)}`}
              <Text style={{fontSize: 14, fontWeight:'normal'}}>/mes</Text>
            </Text>

            <View style={styles.features}>
              {plan.beneficios.map((ben, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={plan.precio > 0 ? "#FFD100" : "green"} />
                  <Text style={[styles.featureText, plan.precio > 0 && {color:'white'}]}>{ben}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.button, plan.precio > 0 ? {backgroundColor: 'white'} : {backgroundColor: '#875686'}]}
              onPress={() => handleSubscribe(plan)}
            >
              <Text style={[styles.buttonText, plan.precio > 0 ? {color: '#875686'} : {color: 'white'}]}>
                {plan.precio > 0 ? 'OBTENER PREMIUM' : 'PLAN ACTUAL'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginLeft: 20, color: '#333' },
  scroll: { padding: 20, paddingBottom: 50 },
  hero: { alignItems: 'center', marginBottom: 30 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 10, color: '#333' },
  heroSub: { fontSize: 14, color: '#666', marginTop: 5 },
  
  card: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  basicCard: { backgroundColor: 'white' },
  premiumCard: { backgroundColor: '#875686' }, // Paw Purple
  
  badge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFD100',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  
  planName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  
  features: { marginBottom: 25 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureText: { marginLeft: 10, fontSize: 14, color: '#555' },
  
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold', fontSize: 16 }
});

export default SubscriptionScreen;