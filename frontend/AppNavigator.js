// frontend/AppNavigator.js

import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar todas las pantallas
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SuccessScreen from './screens/SuccessScreen';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import PetProfileScreen from './screens/PetProfileScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentScreen from './screens/PaymentScreen';
import UploadProofScreen from './screens/UploadProofScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import AddAddressScreen from './screens/AddAddressScreen';
import AddPetScreen from './screens/AddPetScreen';
import EditPetScreen from './screens/EditPetScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import NutritionistScreen from './screens/NutritionistScreen';
import RequestDietScreen from './screens/RequestDietScreen'; // ✅ NUEVO IMPORT

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* ======================================================
   Stack para Home → Detalle de Producto
====================================================== */
function HomeStack({ route }) {
  const { clienteId } = route.params || {};
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFeed" component={HomeScreen} initialParams={{ clienteId }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

/* ======================================================
   Navegador de Tabs Principal
====================================================== */
function MainTabs({ route }) {
  const { clienteId } = route.params || {};
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 5,
          backgroundColor: '#875686',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 90,
          borderTopWidth: 0,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          color: 'white',
          fontSize: 10,
          marginBottom: 20,
        },
        tabBarActiveTintColor: '#FF8C42',
        tabBarInactiveTintColor: 'white',
        tabBarItemStyle: {
          paddingBottom: 5,
          height: '100%',
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          
          // ✅ Lógica de iconos actualizada
          if (route.name === 'HomeStack') iconName = 'home';
          else if (route.name === 'Nutritionist') iconName = 'nutrition'; // Nuevo icono
          else if (route.name === 'PetProfile') iconName = 'paw';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'Favorites') iconName = 'heart';

          if (focused) {
            return (
              <View
                style={{
                  backgroundColor: '#FF8C42',
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ translateY: -20 }],
                  elevation: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                }}
              >
                <Ionicons name={iconName} size={30} color="white" />
              </View>
            );
          }
          return (
            <View> 
              <Ionicons name={iconName} size={24} color="white" />
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStack} 
        initialParams={{ clienteId }} 
        options={{ tabBarLabel: 'Inicio' }} 
      />
      
      {/* ✅ NUEVA PESTAÑA NUTRICIONISTA */}
      <Tab.Screen 
        name="Nutritionist" 
        component={NutritionistScreen} 
        initialParams={{ clienteId }} 
        options={{ tabBarLabel: 'Nutri' }} 
      />

      <Tab.Screen 
        name="PetProfile" 
        component={PetProfileScreen} 
        initialParams={{ clienteId }} 
        options={{ tabBarLabel: 'Mascotas' }} 
      />
      
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        initialParams={{ clienteId }} 
        options={{ tabBarLabel: 'Carrito' }} 
      />
      
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        initialParams={{ clienteId }} 
        options={{ tabBarLabel: 'Favoritos' }} 
      />
    </Tab.Navigator>
  );
}

/* ======================================================
   Navegador Global
====================================================== */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />

        {/* App principal con Tabs */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Flujo de compra y otras pantallas */}
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="UploadProof" component={UploadProofScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        
        {/* Modales */}
        <Stack.Screen name="AddAddress" component={AddAddressScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="AddPet" component={AddPetScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="EditPet" component={EditPetScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        
        {/* Suscripciones */}
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen} 
          options={{ presentation: 'modal' }} 
        />

        {/* ✅ Formulario de Solicitud de Dieta */}
        <Stack.Screen name="RequestDiet" component={RequestDietScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;