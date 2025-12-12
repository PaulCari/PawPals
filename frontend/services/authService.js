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
    const response = await api.post('/auth/login', {
      correo, 
      contrasena, 
    });
    return response.data; 
  } catch (error) {
    console.error('Error en el servicio de login:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Función para registrar un nuevo usuario.
 * Llama al endpoint POST /auth/register.
 * @param {Object} userData - Objeto con { nombre, correo, contrasena }.
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error en el servicio de registro:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Obtiene el perfil completo de un cliente.
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Object>}
 */
export const getClienteProfile = async (clienteId) => {
  try {
    if (!clienteId) throw new Error("ID de cliente es requerido");
    const response = await api.get(`/cliente/id/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener perfil del cliente:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔹 Actualiza el perfil del cliente.
 * Endpoint: PUT /cliente/{cliente_id}
 * Acepta nombre, telefono y un archivo foto (multipart/form-data).
 *
 * @param {number} clienteId
 * @param {string} nombre
 * @param {string} telefono
 * @param {object | null} fotoUri { uri, mimeType, name }
 * @returns {Promise<object>}
 */
export const updateClientProfile = async (clienteId, nombre, telefono, fotoUri) => {
  try {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('telefono', telefono);

    if (fotoUri) {
      formData.append('foto', {
        uri: fotoUri.uri,
        type: fotoUri.mimeType,
        name: fotoUri.name,
      });
    }

    const response = await api.put(`/cliente/${clienteId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error.response?.data || error.message);
    throw error;
  }
};