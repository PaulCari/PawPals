// frontend/screens/ProductDetailScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/productDetailScreenStyles';
import { getProductById } from '../services/productService';
import { addFavorite, removeFavorite, checkFavorite } from '../services/favoriteService';
import { addToCart } from '../services/cartService';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId, clienteId } = route.params;

  // Estados
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleAddToCart = async () => {
  if (!clienteId) {
    Alert.alert('Error', 'No se pudo identificar al usuario.');
    return;
  }

  try {
    console.log('🛒 Agregando al carrito:', {
      clienteId,
      productId,
      quantity,
      productName: product.nombre
    });
    
    await addToCart(clienteId, product, quantity);
    
    console.log('✅ Producto agregado al carrito exitosamente');
    
    Alert.alert(
      "¡Añadido al Carrito!",
      `${product.nombre} (${quantity} unid.) se agregó correctamente.`,
      [
        { 
          text: "Ver Carrito", 
          onPress: () => {
            console.log('📱 Navegando a Cart con clienteId:', clienteId);
            navigation.navigate('Cart', { clienteId });
          }
        },
        { text: "Seguir Comprando", style: "cancel" }
      ],
      { cancelable: true }
    );
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    Alert.alert('Error', 'No se pudo agregar al carrito.');
  }
};
  
   useEffect(() => {
    if (!clienteId) {
      console.error('❌ No se recibió cliente_id en ProductDetailScreen');
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      navigation.goBack();
    }
  }, [clienteId]);
 
  // Cargar datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      if (!clienteId) return;
      
      try {
        const data = await getProductById(productId);
        setProduct(data);
          
        // ✅ USAR clienteId recibido por parámetro
        const favStatus = await checkFavorite(clienteId, productId);
        setIsFavorite(favStatus.es_favorito);
      } catch (error) {
        console.error('❌ Error cargando producto:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, clienteId]);


  // Manejadores
  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Manejador de Favorito con notificación
  const handleFavorite = async () => {
    if (favoriteLoading || !clienteId) return;
    
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Eliminar de favoritos
        await removeFavorite(clienteId, productId);
        setIsFavorite(false);
        Alert.alert(
          "Eliminado de Favoritos",
          `${product.nombre} fue eliminado de tus favoritos.`,
          [{ text: "OK" }]
        );


      } else {
        // Agregar a favoritos
        await addFavorite(clienteId, productId);
        setIsFavorite(true);
        Alert.alert(
          "¡Agregado a Favoritos!",
          `${product.nombre} fue agregado a tus favoritos.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ocurrió un error al actualizar favoritos.';
      Alert.alert('Error', errorMessage);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#875686" />
          <Text style={{ marginTop: 10, color: '#666' }}>Cargando producto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error - producto no encontrado
  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Image source={require('../assets/logo_amarillo.png')} style={styles.logo} />
          <View style={{ width: 30 }} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el producto</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Imagen del producto
  const imageSource = product.imagen 
    ? { uri: product.imagen } 
    : require('../assets/placeholder.png');

  return (
    <SafeAreaView style={styles.safeArea}>

    {/* 🔥 FONDO IGUAL AL HOME Y FAVORITES */}
    <ImageBackground
      source={require('../assets/FONDOA.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    />

    {/* Header Morado */}
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Image source={require('../assets/logo_amarillo.png')} style={styles.logo} />
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Contenedor Principal */}
      <View style={styles.container}>
        {/* Imagen Flotante - FUERA del ScrollView */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.productImage} />
        </View>

        {/* Botón Favorito Flotante MODIFICADO */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavorite} // 👈 Acción de click
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} // 👈 Cambia el ícono si es favorito
            size={28} 
            color="#875686" 
          />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Contenido */}
          <View style={styles.contentContainer}>
            {/* Título */}
            <Text style={styles.productName}>{product.nombre}</Text>

            {/* Precio */}
            <View style={styles.priceRow}>
              <Text style={styles.productPrice}>
                S/ {product.precio?.toFixed(2) || '0.00'}
              </Text>
            </View>

            {/* Etiquetas */}
            <View style={styles.tagsContainer}>
              {['Alto en Proteína', 'BARF', 'Sin Conservantes'].map((tag, index) => (
                <View key={`test-${index}`} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Ingredientes Clave */}
            {product.descripcion && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredientes Clave</Text>
                <Text style={styles.sectionText}>{product.descripcion}</Text>
              </View>
            )}

            {/* Beneficios Clave */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Beneficios Clave</Text>
              <Text style={styles.sectionText}>
                • Alto contenido nutricional{'\n'}
                • Ingredientes naturales{'\n'}
                • Especialmente formulado para tu mascota
              </Text>
            </View>

            {/* Contador de Cantidad */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={handleDecrement}
              >
                <Ionicons name="remove" size={24} color="white" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={handleIncrement}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Botón Agregar al Carrito */}
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={handleAddToCart} // 👈 Llamará al Alert
            >
              <Ionicons name="cart" size={24} color="white" />
              <Text style={styles.addToCartText}>Agregar al carrito</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Barra de Navegación Inferior */}
      
    </SafeAreaView>
  );
};

export default ProductDetailScreen;