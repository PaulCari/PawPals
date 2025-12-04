// Archivo: services/authService.js

import api from './api'; // Importamos nuestra instancia configurada de axios

/**
 * Función para iniciar sesión.
 * Llama al endpoint POST /auth/login.
 * @param {string} correo 
 * @param {string} contrasena 
 * @returns {Promise<Object>} 
 */
export const login = async (correo, contrasena) => {
  try {
    // El segundo argumento de api.post es el cuerpo (body) de la petición
    const response = await api.post('/auth/login', {
      correo, 
      contrasena, 
    });
    // Devolvemos los datos de la respuesta para que el componente los maneje
    return response.data; 
  } catch (error) {
    // Imprimimos un error más detallado en la consola para depuración
    console.error('Error en el servicio de login:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    // Propagamos el error para que el componente pueda mostrar un mensaje al usuario
    throw error;
  }
};

/**
 * Función para registrar un nuevo usuario.
 * Llama al endpoint POST /auth/register.
 * @param {Object} userData - Objeto con { nombre, correo, contrasena }.
 * @returns {Promise<Object>} La respuesta del servidor.
 */
export const register = async (userData) => {
  try {
    console.log('=== INICIANDO REGISTRO ===');
    console.log('URL Base:', api.defaults.baseURL);
    console.log('Ruta completa:', `${api.defaults.baseURL}auth/register`);
    console.log('Enviando datos de registro:', { ...userData, contrasena: '***' });
    
    const response = await api.post('/auth/register', userData);
    
    console.log('✓ Registro exitoso:', response.data);
    console.log('=== FIN REGISTRO ===');
    // Devolvemos los datos de la respuesta (ej. un mensaje de éxito y token)
    return response.data;
  } catch (error) {
    console.error('=== ERROR EN REGISTRO ===');
    console.error('Error en el servicio de registro:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });
    console.error('=== FIN ERROR ===');
    throw error;
  }
};