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
    console.error('Error en el servicio de login:', error.response ? error.response.data : error.message);
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
    const response = await api.post('/auth/register', userData);
    // Devolvemos los datos de la respuesta (ej. un mensaje de éxito)
    return response.data;
  } catch (error) {
    console.error('Error en el servicio de registro:', error.response ? error.response.data : error.message);
    throw error;
  }
};