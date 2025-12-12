import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const NotificationScreen = ({ navigation, route }) => {
  // 1. Evitar crash si route.params es undefined
  const { clienteId } = route.params || {}; 
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log("🔔 Pantalla Notificaciones cargada. Cliente ID:", clienteId);
    
    if (clienteId) {
      fetchNotifications();
    } else {
      console.error("❌ Error: No se recibió clienteId en los parámetros de navegación.");
      Alert.alert("Error", "No se pudo identificar al usuario.");
    }
  }, [clienteId]);

  const fetchNotifications = async () => {
    try {
      console.log(`🔄 Solicitando notificaciones al backend...`);
      const res = await api.get(`/cliente/${clienteId}/notificaciones`);
      
      console.log(`✅ ${res.data.length} notificaciones recibidas:`, res.data);
      setNotifications(res.data);
    } catch (error) {
      console.error("❌ Error cargando notificaciones:", error);
      if (error.response) {
        console.error("   Detalle servidor:", error.response.status, error.response.data);
      }
    }
  };

  const handlePress = (item) => {
    if (item.tipo === 'DIETA_LISTA') {
      console.log("🚀 Navegando a detalle de mascota:", item.referencia_id);
      navigation.navigate('PetDetail', { 
        clienteId, 
        petId: item.referencia_id 
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      <View style={[styles.iconBox, item.tipo === 'DIETA_LISTA' ? {backgroundColor: '#FF8C42'} : {backgroundColor: '#875686'}]}>
        <Ionicons name={item.tipo === 'DIETA_LISTA' ? "restaurant" : "notifications"} size={24} color="white" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.message}>{item.mensaje}</Text>
        <Text style={styles.date}>{new Date(item.fecha).toLocaleDateString()} {new Date(item.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/FONDOA.png')} style={styles.bg} resizeMode="cover" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{width: 28}} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
            <View style={{alignItems: 'center', marginTop: 50}}>
                <Ionicons name="notifications-off-outline" size={50} color="#ccc" />
                <Text style={styles.empty}>No tienes notificaciones nuevas.</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#875686' },
  bg: { ...StyleSheet.absoluteFillObject },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  list: { padding: 20, backgroundColor: '#F9F9F9', borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: '100%' },
  
  card: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  content: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  message: { color: '#666', fontSize: 13, marginTop: 2 },
  date: { color: '#999', fontSize: 10, marginTop: 5 },
  empty: { textAlign: 'center', color: '#888', marginTop: 10 }
});

export default NotificationScreen;