import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener expo icons
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { styles } from '../styles/homeScreenStyles';
import { useCart } from '../context/CartContext'; // Importamos el contexto

const HomeScreen = ({ navigation }) => {
  // === 1. LÓGICA DE ESTADO ===
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Obtenemos la cantidad de items del carrito para mostrar en el icono
  const { cartItems } = useCart(); 
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Categorías hardcodeadas (puedes traerlas de la BD luego)
  const categories = ['Todos', 'Perros', 'Gatos', 'Especiales'];

  // === 2. LÓGICA DE DATOS ===
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
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

  // Filtrado simple en el frontend
  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.categoria?.nombre === selectedCategory); 
    // Nota: Asegúrate de que tu backend devuelve 'categoria.nombre' o ajusta esta línea

  // === 3. RENDERIZADO (UI) ===
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#875686" />

      {/* --- FONDO DECORATIVO --- */}
      {/* Puedes reemplazar estos sources con tus require('../assets/img.png') reales */}
      <Image source={require('../assets/ellipse.png')} style={styles.ellipseImage} /> 
      <Image source={require('../assets/paw.png')} style={styles.pawImage} />
      <Image source={require('../assets/bone.png')} style={styles.boneImage} />

      {/* --- HEADER --- */}
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PawPals 🐾</Text>
          
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color="#FFF" />
            {totalItems > 0 && (
              <View style={{
                position: 'absolute',
                top: -5, right: -5,
                backgroundColor: 'red',
                borderRadius: 10,
                width: 20, height: 20,
                justifyContent: 'center', alignItems: 'center'
              }}>
                <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* --- CUERPO PRINCIPAL (Curvo) --- */}
      <View style={styles.bodyContainer}>
        <Text style={styles.welcomeText}>¡Hola! 👋</Text>
        <Text style={styles.subTitle}>¿Qué le daremos a tu mascota hoy?</Text>

        {/* Selector de Categorías */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de Productos */}
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay platos en esta categoría.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard 
                item={item} 
                onPress={() => navigation.navigate('ProductDetail', { product: item })} 
              />
            )}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#875686']} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;