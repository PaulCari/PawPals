// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { styles } from '../styles/homeScreenStyles';

/**
 * Pantalla principal del cliente.
 * Muestra los platos activos y publicados desde el backend.
 */
const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Cargar productos desde el backend
  const fetchProducts = async () => {
    try {
      const data = await getProducts(); // sin filtros → devuelve todos los platos
      setProducts(data);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FFB800" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (products.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron platos disponibles.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

