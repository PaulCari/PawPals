// frontend/services/petService.js - VERSIÓN CORREGIDA

import api from './api';

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
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
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
 *  FUNCIÓN CORREGIDA: Actualiza los datos de una mascota
 */
export const updatePet = async (mascotaId, updateData) => {
  try {
    console.log('📤 Actualizando mascota:', mascotaId);
    console.log('📋 Datos a enviar:', updateData);

    const formData = new FormData();
    
    // Agregar campos de texto
    if (updateData.nombre) {
      formData.append('nombre', updateData.nombre);
    }
    
    if (updateData.edad) {
      formData.append('edad', updateData.edad.toString());
    }
    
    if (updateData.peso) {
      formData.append('peso', updateData.peso.toString());
    }
    
    if (updateData.raza) {
      formData.append('raza', updateData.raza);
    }
    
    if (updateData.observaciones) {
      formData.append('observaciones', updateData.observaciones);
    }
    
    //  MANEJO CORRECTO DE LA FOTO
    if (updateData.foto) {
      // Verificar si es una foto nueva (no es una URL del servidor)
      if (updateData.foto.uri && !updateData.foto.uri.startsWith('http')) {
        console.log('📸 Subiendo nueva foto:', updateData.foto.uri);
        
        // Obtener la extensión del archivo
        const uriParts = updateData.foto.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        // Crear objeto de archivo para React Native
        const photoFile = {
          uri: updateData.foto.uri,
          name: `pet_${mascotaId}_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        };
        
        formData.append('foto', photoFile);
        console.log('✅ Foto agregada al FormData');
      } else {
        console.log('ℹ️ No hay foto nueva para subir');
      }
    }

    console.log('📡 Enviando actualización al backend...');

    const response = await api.put(
      `/cliente/mascotas/${mascotaId}`, 
      formData, 
      {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('✅ Mascota actualizada exitosamente:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error al actualizar mascota:', error.response?.data || error.message);
    
    // Mostrar detalles del error para debugging
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📋 Data:', error.response.data);
      console.error('📝 Headers:', error.response.headers);
    }
    
    throw error;
  }
};

/**
 * Elimina una mascota.
 */
export const deletePet = async (mascotaId) => {
  try {
    console.log('🗑️ Eliminando mascota:', mascotaId);
    const response = await api.delete(`/cliente/mascotas/${mascotaId}`);
    console.log('✅ Mascota eliminada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar mascota:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene una lista de razas para una especie específica.
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