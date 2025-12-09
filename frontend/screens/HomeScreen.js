// frontend/screens/HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para los iconos del header

// Importamos todos los servicios que necesitamos
import { getProducts, getCategories } from '../services/productService';
// Asumimos que tienes una forma de obtener los datos del usuario y sus mascotas
// Por ahora, usaremos datos de ejemplo
// import { getUserProfile, getMyPets } from '../services/userService'; // (esto sería lo ideal)

import ProductCard from '../components/ProductCard';
import { styles } from '../styles/homeScreenStyles'; // Crearemos/modificaremos este archivo

const HomeScreen = ({ navigation }) => {
  // Estados para los datos
  const [userName, setUserName] = useState("Paúl"); // Ejemplo
  const [petName, setPetName] = useState("Caramelo"); // Ejemplo
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Estado para la lógica de la UI
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect para cargar categorías y los productos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          const firstCategoryId = categoriesData[0].id;
          setActiveCategoryId(firstCategoryId); // Activamos la primera categoría por defecto
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
    setLoading(true); // Muestra el spinner mientras cargan los nuevos productos
    try {
      const productsData = await getProducts({ categoria_id: categoryId });
      setProducts(productsData);
    } catch (error) {
      console.error(`❌ Error cargando productos para la categoría ${categoryId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // ... (dentro de HomeScreen.js, después de la lógica anterior)

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header Morado */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* 2. Contenedor Blanco Principal */}
      <View style={styles.container}>
        <Text style={styles.welcomeTitle}>Bienvenido {userName} y {petName}!!</Text>

        {/* 3. Filtro de Categorías */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategoryId === category.id && styles.activeCategoryButton
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={[
                styles.categoryText,
                activeCategoryId === category.id && styles.activeCategoryText
              ]}>{category.nombre}</Text>
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
            renderItem={({ item }) => <ProductCard item={item} />}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay productos en esta categoría.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
