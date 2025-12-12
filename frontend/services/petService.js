// frontend/services/petService.js

import api from './api';
import { Platform } from 'react-native';

/**
 * Registra una nueva mascota para un cliente específico.
 */
export const createPet = async (clienteId, petData) => {
  try {
    const formData = new FormData();
    formData.append('nombre', petData.nombre);
    formData.append('especie_id', petData.especie_id);
    formData.append('raza', petData.raza);
    formData.append('edad', petData.edad.toString());
    formData.append('sexo', petData.sexo);

    const response = await api.post(
      `/cliente/mascotas/${clienteId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error al crear la mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene la lista de especies disponibles.
 */
export const getSpecies = async () => {
  try {
    const response = await api.get('/cliente/platos-mascotas/especies');
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener especies:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene todas las mascotas de un cliente.
 */
export const getPetsByCliente = async (clienteId) => {
  try {
    const response = await api.get(`/cliente/mascotas/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener mascotas:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene el detalle completo de una mascota.
 */
export const getPetDetail = async (mascotaId) => {
  try {
    const response = await api.get(`/cliente/mascotas/detalle/${mascotaId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener detalle de mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Actualiza los datos de una mascota.
 */
export const updatePet = async (mascotaId, updateData) => {
  if (updateData.foto && !updateData.foto.uri.startsWith('http')) {
      
      // 1. Determinar el tipo de archivo de forma segura
      let fileType = 'jpg'; // Por defecto
      const uri = updateData.foto.uri;

      if (uri.includes('png')) {
        fileType = 'png';
      } else if (uri.includes('jpeg') || uri.includes('jpg')) {
        fileType = 'jpg';
      }

      // 2. Crear un nombre de archivo LIMPIO (sin dos puntos ni slashes)
      const cleanFileName = `mascota_${mascotaId}_${Date.now()}.${fileType}`;

      if (Platform.OS === 'web') {
        // --- WEB ---
        // Convertir la URI blob a un objeto Blob real
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Enviar el Blob con el nombre limpio
        formData.append('foto', blob, cleanFileName);
      } else {
        // --- MÓVIL (Android/iOS) ---
        const fileToSend = {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          name: cleanFileName,
          type: `image/${fileType === 'jpg' ? 'jpeg' : 'png'}`,
        };
        formData.append('foto', fileToSend);
      }
    }
  try {
    const formData = new FormData();
    if (updateData.nombre) formData.append('nombre', updateData.nombre);
    if (updateData.edad) formData.append('edad', updateData.edad.toString());
    if (updateData.peso) formData.append('peso', updateData.peso.toString());
    if (updateData.raza) formData.append('raza', updateData.raza);
    if (updateData.observaciones) formData.append('observaciones', updateData.observaciones);
    
    if (updateData.foto && !updateData.foto.uri.startsWith('http')) {
      const uriParts = updateData.foto.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      const fileToSend = {
        uri: Platform.OS === 'ios' ? updateData.foto.uri.replace('file://', '') : updateData.foto.uri,
        name: `pet_${mascotaId}.${fileType}`,
        type: `image/${fileType}`,
      };

      if (Platform.OS === 'web') {
        // En web, convertir a Blob
        const response = await fetch(updateData.foto.uri);
        const blob = await response.blob();
        formData.append('foto', blob, fileToSend.name);
      } else {
        formData.append('foto', fileToSend);
      }
    }

    // Configuración headers dinámica para web/mobile
    const headers = { 'Accept': 'application/json' };
    if (Platform.OS !== 'web') headers['Content-Type'] = 'multipart/form-data';

    const response = await api.put(`/cliente/mascotas/${mascotaId}`, formData, {
      headers,
      transformRequest: Platform.OS === 'web' ? null : (data) => data,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Elimina una mascota.
 */
export const deletePet = async (mascotaId) => {
  try {
    const response = await api.delete(`/cliente/mascotas/${mascotaId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Crea un pedido especializado (Solicitud de dieta).
 * Maneja lógica híbrida para Web y Móvil.
 */
export const createSpecializedRequest = async (clienteId, requestData, file = null) => {
  try {
    const formData = new FormData();
    
    // 1. Datos de texto
    formData.append('registro_mascota_id', String(requestData.mascotaId));
    formData.append('objetivo_dieta', requestData.objetivo);
    formData.append('frecuencia_cantidad', requestData.frecuencia);
    formData.append('consulta_nutricionista', 'true'); 
    
    if (requestData.observaciones) {
      formData.append('indicaciones_adicionales', requestData.observaciones);
    }

    // 2. Manejo del Archivo (LÓGICA HÍBRIDA)
    if (file && file.uri) {
      const uriParts = file.uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      
      // Limpieza de extensión para Web (a veces viene con query params o blob:)
      if (fileType.length > 5 || fileType.includes('/') || fileType.includes(':')) {
        fileType = "jpg";
      }

      const filename = `examen_${requestData.mascotaId}.${fileType}`;

      if (Platform.OS === 'web') {
        // 🌐 WEB: Convertir URI a Blob real
        const response = await fetch(file.uri);
        const blob = await response.blob();
        
        // En web, se pasa (Blob, nombre_archivo)
        formData.append('archivo_adicional', blob, filename);
      } else {
        // 📱 MÓVIL: Objeto estándar de React Native
        let mimeType = 'image/jpeg';
        if (fileType.toLowerCase() === 'png') mimeType = 'image/png';
        
        const uri = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;

        formData.append('archivo_adicional', {
          uri: uri,
          name: filename,
          type: mimeType, 
        });
      }
    }

    // 3. Listas vacías
    formData.append('alergias_ids', '[]');
    formData.append('condiciones_salud', '[]');
    formData.append('preferencias_alimentarias', '[]');

    console.log(`📤 Enviando solicitud (Modo: ${Platform.OS})...`);

    // 4. Configuración de Headers (CRUCIAL PARA WEB)
    const headers = { 'Accept': 'application/json' };
    
    // En Web NO poner 'Content-Type': 'multipart/form-data' manual, el navegador lo pone con el boundary.
    // En Móvil SÍ es necesario a veces para que Axios no se confunda.
    if (Platform.OS !== 'web') {
        headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await api.post(
      `/cliente/pedido/especializado/${clienteId}`,
      formData,
      { 
        headers: headers,
        // En Web, transformRequest en null permite que el navegador maneje el FormData nativo.
        // En Móvil, retornamos data para evitar stringify.
        transformRequest: Platform.OS === 'web' ? null : (data) => data
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Error Backend:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Error código:', error.message);
    }
    throw error;
  }
};

/**
 * Obtiene razas.
 */
export const getBreedsBySpecies = async (especieId) => {
  if (!especieId) return [];
  try {
    const response = await api.get(`/cliente/platos-mascotas/especies/${especieId}/razas`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener razas:', error.response?.data || error.message);
    return ["Mestizo"];
  }
};