// frontend/services/cartService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 🛒 SERVICIO DEL CARRITO (Versión React Native con AsyncStorage)
 * Maneja todas las operaciones relacionadas con el carrito de compras
 */

/**
 * Obtiene todos los items del carrito del cliente
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Object>} Carrito con items y total
 */
export const getCart = async (clienteId) => {
  try {
    if (!clienteId) {
      console.error('❌ clienteId no proporcionado en getCart');
      return { items: [], total: 0, subtotal: 0 };
    }

    const cartKey = `cart_${clienteId}`;
    const cartData = await AsyncStorage.getItem(cartKey);
    
    if (!cartData) {
      console.log('📦 Carrito vacío para cliente:', clienteId);
      return { items: [], total: 0, subtotal: 0 };
    }
    
    const cart = JSON.parse(cartData);
    console.log('✅ Carrito cargado:', cart.items.length, 'items');
    return cart;
  } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    return { items: [], total: 0, subtotal: 0 };
  }
};

/**
 * Agrega un producto al carrito
 * @param {string} clienteId - ID del cliente
 * @param {Object} product - Producto a agregar
 * @param {number} quantity - Cantidad
 * @returns {Promise<Object>}
 */
export const addToCart = async (clienteId, product, quantity = 1) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('🛒 Agregando al carrito:', product.nombre, 'x', quantity);
    
    const cart = await getCart(clienteId);
    
    // Buscar si el producto ya existe en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.plato_id === product.id
    );
    
    if (existingItemIndex >= 0) {
      // Si existe, incrementar cantidad
      cart.items[existingItemIndex].cantidad += quantity;
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].cantidad * cart.items[existingItemIndex].precio_unitario;
      console.log('📝 Producto actualizado en carrito');
    } else {
      // Si no existe, agregarlo
      cart.items.push({
        plato_id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio_unitario: product.precio,
        cantidad: quantity,
        subtotal: product.precio * quantity,
        imagen: product.imagen
      });
      console.log('➕ Producto agregado al carrito');
    }
    
    // Recalcular totales
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal; // Aquí podrías agregar descuentos, envío, etc.
    
    // Guardar en AsyncStorage
    const cartKey = `cart_${clienteId}`;
    await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
    
    console.log('💾 Carrito guardado. Total items:', cart.items.length);
    return cart;
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    throw error;
  }
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {string} clienteId - ID del cliente
 * @param {string} platoId - ID del plato
 * @param {number} newQuantity - Nueva cantidad
 * @returns {Promise<Object>}
 */
export const updateCartItemQuantity = async (clienteId, platoId, newQuantity) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('🔄 Actualizando cantidad:', platoId, 'a', newQuantity);
    
    const cart = await getCart(clienteId);
    
    const itemIndex = cart.items.findIndex(item => item.plato_id === platoId);
    
    if (itemIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }
    
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o negativa, eliminar el item
      return await removeFromCart(clienteId, platoId);
    }
    
    // Actualizar cantidad y subtotal
    cart.items[itemIndex].cantidad = newQuantity;
    cart.items[itemIndex].subtotal = 
      newQuantity * cart.items[itemIndex].precio_unitario;
    
    // Recalcular totales
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal;
    
    // Guardar
    const cartKey = `cart_${clienteId}`;
    await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
    
    console.log('✅ Cantidad actualizada');
    return cart;
  } catch (error) {
    console.error('❌ Error al actualizar cantidad:', error);
    throw error;
  }
};

/**
 * Elimina un producto específico del carrito
 * @param {string} clienteId - ID del cliente
 * @param {string} platoId - ID del plato a eliminar
 * @returns {Promise<Object>}
 */
export const removeFromCart = async (clienteId, platoId) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('🗑️ Eliminando del carrito:', platoId);
    
    const cart = await getCart(clienteId);
    
    // Filtrar el item a eliminar
    cart.items = cart.items.filter(item => item.plato_id !== platoId);
    
    // Recalcular totales
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal;
    
    // Guardar
    const cartKey = `cart_${clienteId}`;
    await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
    
    console.log('✅ Producto eliminado. Items restantes:', cart.items.length);
    return cart;
  } catch (error) {
    console.error('❌ Error al eliminar del carrito:', error);
    throw error;
  }
};

/**
 * Vacía completamente el carrito
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<Object>}
 */
export const clearCart = async (clienteId) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    console.log('🧹 Vaciando carrito');
    
    const emptyCart = {
      items: [],
      subtotal: 0,
      total: 0
    };
    
    const cartKey = `cart_${clienteId}`;
    await AsyncStorage.setItem(cartKey, JSON.stringify(emptyCart));
    
    console.log('✅ Carrito vaciado');
    return emptyCart;
  } catch (error) {
    console.error('❌ Error al vaciar carrito:', error);
    throw error;
  }
};

/**
 * Obtiene la cantidad total de items en el carrito
 * @param {string} clienteId - ID del cliente
 * @returns {Promise<number>}
 */
export const getCartItemCount = async (clienteId) => {
  try {
    if (!clienteId) {
      return 0;
    }
    
    const cart = await getCart(clienteId);
    const count = cart.items.reduce((sum, item) => sum + item.cantidad, 0);
    return count;
  } catch (error) {
    console.error('❌ Error al contar items del carrito:', error);
    return 0;
  }
};

/**
 * Finaliza la compra creando un pedido en el backend
 * @param {string} clienteId - ID del cliente
 * @param {string} direccionId - ID de la dirección de entrega
 * @returns {Promise<Object>}
 */
export const checkout = async (clienteId, direccionId) => {
  try {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    const cart = await getCart(clienteId);
    
    if (cart.items.length === 0) {
      throw new Error('El carrito está vacío');
    }
    
    // Preparar datos para el backend
    const pedidoData = {
      direccion_id: direccionId,
      platos: cart.items.map(item => ({
        plato_id: item.plato_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      })),
      total: cart.total
    };
    
    console.log('💳 Procesando checkout:', pedidoData);
    
    // Enviar al backend
    const api = require('./api').default;
    const response = await api.post(`/cliente/pedido/${clienteId}`, pedidoData);
    
    // Si el pedido se creó exitosamente, vaciar el carrito
    if (response.data.pedido_id) {
      await clearCart(clienteId);
      console.log('✅ Pedido creado exitosamente:', response.data.pedido_id);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error al finalizar compra:', error);
    throw error;
  }
};