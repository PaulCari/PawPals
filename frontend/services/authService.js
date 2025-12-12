// frontend/services/authService.js - VERSIÓN CORREGIDA

import api from './api';

/**
 * Función para iniciar sesión.
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
    console.error('❌ Error en login:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Función para registrar un nuevo usuario.
 * @param {Object} userData - { nombre, correo, contrasena }
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('❌ Error en registro:', error.response?.data || error.message);
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
    if (!clienteId) {
      throw new Error("ID de cliente es requerido");
    }

    console.log('📥 Obteniendo perfil para cliente:', clienteId);
    const response = await api.get(`/cliente/id/${clienteId}`);
    
    console.log('✅ Perfil obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Actualiza el perfil del cliente (VERSIÓN CORREGIDA).
 * Endpoint: PUT /cliente/{cliente_id}
 * Acepta nombre, telefono y un archivo foto (multipart/form-data).
 *
 * @param {string} clienteId - ID del cliente
 * @param {Object} updateData - { nombre, telefono }
 * @param {Object|null} photo - Objeto con { uri, type, name } o null
 * @returns {Promise<object>}
 */
export const updateClientProfile = async (clienteId, updateData, photo = null) => {
  try {
    if (!clienteId) {
      throw new Error("ID de cliente es requerido");
    }

    console.log('💾 Actualizando perfil:', clienteId);
    console.log('📝 Datos a actualizar:', updateData);

    // Crear FormData
    const formData = new FormData();
    formData.append('nombre', updateData.nombre);
    formData.append('telefono', updateData.telefono);

    // Agregar foto si existe
    if (photo && photo.uri && !photo.uri.startsWith('http')) {
      console.log('📸 Agregando foto al FormData');
      
      // Extraer extensión del archivo
      const uriParts = photo.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('foto', {
        uri: photo.uri,
        type: `image/${fileType}`,
        name: `profile_${clienteId}.${fileType}`,
      });
    }

    console.log('📤 Enviando actualización...');

    const response = await api.put(`/cliente/${clienteId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Perfil actualizado exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error.response?.data || error.message);
    throw error;
  }
};