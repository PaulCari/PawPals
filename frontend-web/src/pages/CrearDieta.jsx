import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { Search, Plus, Trash2, Save, ShoppingBag, ArrowLeft } from 'lucide-react';

const CrearDieta = () => {
  const { mascotaId } = useParams(); // Necesitamos el ID de la mascota en la URL
  const navigate = useNavigate();

  // Estados
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [nombreMix, setNombreMix] = useState('Fórmula Personalizada');
  const [loading, setLoading] = useState(false);

  // Buscar productos mientras escribe
  const buscarProductos = async (query) => {
    setBusqueda(query);
    if (query.length < 2) {
      setResultados([]);
      return;
    }
    try {
      const res = await api.get(`/nutricionista/items/buscar?q=${query}`);
      setResultados(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Agregar item al mix
  const agregarItem = (item) => {
    setItemsSeleccionados([...itemsSeleccionados, item]);
    setBusqueda(''); // Limpiar buscador
    setResultados([]);
  };

  // Eliminar item del mix
  const eliminarItem = (index) => {
    const nuevosItems = [...itemsSeleccionados];
    nuevosItems.splice(index, 1);
    setItemsSeleccionados(nuevosItems);
  };

  // Calcular total
  const totalPrecio = itemsSeleccionados.reduce((sum, item) => sum + item.precio, 0);

  // Guardar en Backend
  const guardarMix = async () => {
    if (itemsSeleccionados.length === 0) return alert("Agrega al menos un ingrediente");
    
    setLoading(true);
    const descripcion = itemsSeleccionados.map(i => i.nombre).join(' + ');

    const payload = {
      registro_mascota_id: mascotaId,
      nombre_mix: nombreMix,
      items: itemsSeleccionados.map(i => ({ id: i.id, cantidad: 1 })),
      precio_total: totalPrecio,
      descripcion: `Fórmula especial compuesta por: ${descripcion}`
    };

    try {
      await api.post('/nutricionista/platos/mix', payload);
      alert('✅ ¡Menú creado y asignado al paciente!');
      navigate(-1); // Volver
    } catch (error) {
      alert('Error al guardar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)}><ArrowLeft className="text-gray-500" /></button>
        <h1 className="text-2xl font-bold text-paw-dark">Crear Fórmula Personalizada</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-180px)]">
        
        {/* IZQUIERDA: BUSCADOR */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Search size={20} className="text-paw-purple"/> Buscar Ingredientes / Platos
          </h3>
          
          <input 
            type="text" 
            placeholder="Escribe ej: Pollo, Res, Hígado..." 
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-paw-purple outline-none mb-4"
            value={busqueda}
            onChange={(e) => buscarProductos(e.target.value)}
            autoFocus
          />

          <div className="flex-1 overflow-y-auto space-y-3">
            {resultados.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition group cursor-pointer" onClick={() => agregarItem(item)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                    {item.imagen && <img src={`http://localhost:8000/static/imagenes/plato/${item.imagen}`} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.nombre}</p>
                    <p className="text-xs text-gray-500">{item.categoria}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-paw-dark-light">S/ {item.precio.toFixed(2)}</span>
                  <button className="bg-paw-purple text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
            {busqueda && resultados.length === 0 && (
              <p className="text-center text-gray-400 mt-4">No se encontraron productos.</p>
            )}
          </div>
        </div>

        {/* DERECHA: EL PLATO QUE SE ARMA */}
        <div className="bg-gradient-to-br from-gray-900 to-paw-dark text-white p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
            <ShoppingBag className="text-paw-yellow" />
            <input 
              type="text" 
              value={nombreMix} 
              onChange={(e) => setNombreMix(e.target.value)}
              className="bg-transparent text-xl font-bold text-white outline-none w-full placeholder-white/50"
            />
            <Save size={18} className="text-gray-400" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {itemsSeleccionados.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-white/30 border-2 border-dashed border-white/10 rounded-xl">
                <p>Agrega ingredientes aquí</p>
              </div>
            ) : (
              itemsSeleccionados.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <span className="font-medium">{item.nombre}</span>
                  <div className="flex items-center gap-4">
                    <span>S/ {item.precio.toFixed(2)}</span>
                    <button onClick={() => eliminarItem(index)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-400">Precio Total</span>
              <span className="text-3xl font-bold text-paw-yellow">S/ {totalPrecio.toFixed(2)}</span>
            </div>
            <button 
              onClick={guardarMix}
              disabled={loading || itemsSeleccionados.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${loading ? 'bg-gray-600' : 'bg-paw-yellow text-paw-dark hover:bg-yellow-400'}`}
            >
              {loading ? 'Guardando...' : 'Crear y Asignar Menú'}
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default CrearDieta;