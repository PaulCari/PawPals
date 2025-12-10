// frontend/screens/HomeScreen.js

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { styles } from '../styles/homeScreenStyles';

const HomeScreen = ({ navigation, route }) => {
  // Estados para los datos
  const clienteId = route.params?.clienteId;
  const [userName, setUserName] = useState("Paúl");
  const [petName, setPetName] = useState("Caramelo");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Estado para la lógica de la UI
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect para verificar clienteId
  useEffect(() => {
    if (!clienteId) {
      console.error('❌ No se recibió cliente_id');
      // Opcional: redirigir al login
      // navigation.replace('Login');
    } else {
      console.log('✅ Cliente ID:', clienteId);
    }
  }, [clienteId]);
  
  // useEffect para cargar categorías y los productos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          const firstCategoryId = categoriesData[0].id;
          setActiveCategoryId(firstCategoryId);
          const productsData = await getProducts({ categoria_id: firstCategoryId });
          setProducts(productsData);
        }
      } catch (error) {
        console.error("❌ Error cargando datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);
  

  // Función para manejar el cambio de categoría
  const handleCategoryPress = async (categoryId) => {
    setActiveCategoryId(categoryId);
    setLoading(true);
    try {
      const productsData = await getProducts({ categoria_id: categoryId });
      setProducts(productsData);
    } catch (error) {
      console.error(`❌ Error cargando productos para la categoría ${categoryId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header Morado */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
        <Image source={require('../assets/logo_amarillo.png')} style={styles.logo} />
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* 2. Contenedor Blanco Principal */}
      <View style={styles.container}>
        <Text style={styles.welcomeTitle}>Bienvenido {userName} y {petName}!!</Text>

        {/* 3. Filtro de Categorías con línea inferior */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={[
                styles.categoryText,
                activeCategoryId === category.id && styles.activeCategoryText
              ]}>{category.nombre}</Text>
              {activeCategoryId === category.id && (
                <View style={styles.categoryUnderline} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 4. Lista de Productos */}
        {loading ? (
          <ActivityIndicator size="large" color="#875686" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={products}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ProductCard 
                item={item} 
                clienteId={clienteId}
                isCenter={index === Math.floor(products.length / 2)} 
              />
            )}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay productos en esta categoría.</Text>}
            snapToInterval={300} // Para efecto de snap
            decelerationRate="fast"
          />
        )}
      </View>

      {/* 5. Barra de Navegación Inferior */}
      
    </SafeAreaView>
  );
};

export default HomeScreen;