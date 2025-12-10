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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/productDetailScreenStyles';
import { getProductById } from '../services/productService';
import { addFavorite, removeFavorite, checkFavorite } from '../services/favoriteService';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId, clienteId } = route.params;

  // Estados
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

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

  const handleAddToCart = () => {
    console.log(`Agregando ${quantity} unidades del producto ${productId} al carrito`);
    
    // 👈 AÑADIDO: Ventana emergente de confirmación
    Alert.alert(
      "¡Añadido al Carrito!",
      `${product.nombre} (${quantity} unid.) se agregó correctamente.`,
      [
        { text: "Ver Carrito", onPress: () => setActiveTab('cart') },
        { text: "Seguir Comprando", style: "cancel" }
      ],
      { cancelable: true }
    );
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
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => {
            setActiveTab('home');
            navigation.navigate('Home', { clienteId });
          }}
        >
          <View style={[
            styles.navIconContainer,
            activeTab === 'home' && styles.activeNavButton
          ]}>
            <Ionicons 
              name="home" 
              size={26} 
              color="white"
            />
          </View>
          <Text style={[
            styles.navText,
            activeTab === 'home' && styles.activeNavText
          ]}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => setActiveTab('pet')}
        >
          <View style={[
            styles.navIconContainer,
            activeTab === 'pet' && styles.activeNavButton
          ]}>
            <Ionicons 
              name="paw" 
              size={26} 
              color="white"
            />
          </View>
          <Text style={[
            styles.navText,
            activeTab === 'pet' && styles.activeNavText
          ]}>Perfil Mascota</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => setActiveTab('cart')}
        >
          <View style={[
            styles.navIconContainer,
            activeTab === 'cart' && styles.activeNavButton
          ]}>
            <Ionicons 
              name="cart" 
              size={26} 
              color="white"
            />
          </View>
          <Text style={[
            styles.navText,
            activeTab === 'cart' && styles.activeNavText
          ]}>Carrito</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Favorites', { clienteId })}
        >
          <View style={[
            styles.navIconContainer,
            activeTab === 'settings' && styles.activeNavButton
          ]}>
            <Ionicons 
              name="settings" 
              size={26} 
              color="white"
            />
          </View>
          <Text style={[
            styles.navText,
            activeTab === 'settings' && styles.activeNavText
          ]}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;