// Archivo: AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importamos todas las pantallas
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen'; 
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SuccessScreen from './screens/SuccessScreen';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"  
        screenOptions={{ headerShown: false }} // Oculta la barra de título superior
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* ▼▼▼ LA LÍNEA CORREGIDA ESTÁ AQUÍ ▼▼▼ */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        <Stack.Screen name="Success" component={SuccessScreen} />
        {/* He corregido también el name de HomeScreen para mantener la consistencia */}
        <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;