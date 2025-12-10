// frontend/screens/FavoritesScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getFavorites, removeFavorite } from '../services/favoriteService';
import { styles } from '../styles/favoritesScreenStyles';

const FavoritesScreen = ({ navigation, route }) => {
     const { clienteId } = route.params || {};
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites');

    // Verificar que clienteId esté presente
    useEffect(() => {
        if (!clienteId) {
            console.error('❌ No se recibió clienteId en FavoritesScreen');
            Alert.alert('Error', 'No se pudo identificar al usuario.');
            navigation.goBack();
        }
    }, [clienteId]);

  // Cargar favoritos al entrar a la pantalla
  const loadFavorites = async () => {
    if (!clienteId) return;
    try {
      const data = await getFavorites(clienteId);
      setFavorites(data.favoritos || []);
    } catch (error) {
      console.error('❌ Error cargando favoritos:', error);
      Alert.alert('Error', 'No se pudieron cargar los favoritos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Recargar cuando la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [clienteId])
  );

  // Función para refrescar
  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  // Función para eliminar de favoritos
  const handleRemoveFavorite = async (platoId, platoNombre) => {
    if (!clienteId) return;

    Alert.alert(
      "Eliminar de Favoritos",
      `¿Deseas eliminar "${platoNombre}" de tus favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFavorite(clienteId, platoId);
              // Actualizar lista localmente
              setFavorites(prev => prev.filter(fav => fav.plato.id !== platoId));
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar de favoritos.');
            }
          }
        }
      ]
    );
  };

  // Navegar al detalle del producto
  const handleProductPress = (productId) => {
  navigation.navigate('HomeStack', { 
    screen: 'ProductDetail', 
    params: { productId, clienteId } 
  });
};

  // Renderizar cada tarjeta de favorito
  const renderFavoriteCard = ({ item }) => {
  const plato = item.plato;
  const imageSource = plato.imagen
    ? { uri: plato.imagen }
    : require('../assets/placeholder.png');

  return (
    // 1. El View exterior ya no es un botón
    <View style={styles.card}>
      
      {/* 2. Hacemos que la imagen y el texto sean el botón para ir al detalle */}
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} // Estilos para que ocupe el espacio
        onPress={() => handleProductPress(plato.id)}
        activeOpacity={0.8}
      >
        <Image source={imageSource} style={styles.cardImage} />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{plato.nombre}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{plato.descripcion || 'Sin descripción'}</Text>
          <Text style={styles.cardPrice}>S/ {plato.precio?.toFixed(2) || '0.00'}</Text>
        </View>
      </TouchableOpacity>
      
      {/* 3. El botón del corazón es un elemento separado y no hay riesgo de solapamiento */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(plato.id, plato.nombre)}
      >
        <Ionicons name="heart" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
};

  return (
    <SafeAreaView style={styles.safeArea}>

    {/* 🔥 FONDO IGUAL AL HOME */}
    <ImageBackground
      source={require('../assets/FONDOA.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    />

    {/* HEADER */}
    <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="menu" size={30} color="white" />
    </TouchableOpacity>

  <Image 
    source={require('../assets/logo_amarillo.png')} 
    style={styles.logo}
  />

  <TouchableOpacity
  onPress={() => navigation.navigate('Cart', { clienteId })}
>
  <Ionicons name="cart-outline" size={30} color="white" />
</TouchableOpacity>
</View>

      {/* Contenedor Principal */}
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#875686" />
            <Text style={styles.loadingText}>Cargando favoritos...</Text>
          </View>
        ) : favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={100} color="#ccc" />
            <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
            <Text style={styles.emptySubtitle}>
              Explora nuestros productos y agrega tus favoritos
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Home', { clienteId })}
            >
              <Text style={styles.exploreButtonText}>Explorar Productos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.countText}>
              {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}
            </Text>
            <FlatList
              data={favorites}
              renderItem={renderFavoriteCard}
              keyExtractor={(item) => item.favorito_id.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </>
        )}
      </View>

      
    </SafeAreaView>
  );
};

export default FavoritesScreen;