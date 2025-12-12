import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  ArrowLeft, Save, AlertTriangle, FileText, 
  Dog, CheckCircle, Paperclip, Eye 
} from 'lucide-react';

// URL Base del Backend para cargar imágenes estáticas
const BASE_URL = 'http://localhost:8000';

const SolicitudDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    observaciones: '',
    recomendaciones: '',
    aprobado: true
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await api.get(`/nutricionista/pedidos/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error cargando detalle:", error);
        alert("No se pudo cargar la solicitud.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const enviarRevision = async () => {
    if (!form.observaciones || !form.recomendaciones) {
      alert("Por favor completa las observaciones y recomendaciones.");
      return;
    }

    try {
      await api.post(`/nutricionista/pedidos/${id}/revisar`, form);
      alert("✅ ¡Revisión guardada y enviada al cliente!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar la revisión.");
    }
  };

  // Función para construir la URL de la imagen
  const getFileUrl = (path) => {
    if (!path) return null;
    // Normalizar slashes para Windows/Linux
    const cleanPath = path.replace(/\\/g, '/');
    return `${BASE_URL}/${cleanPath}`;
  };

  if (loading) return <div className="p-10 text-center">Cargando expediente...</div>;
  if (!data) return <div className="p-10 text-center">Solicitud no encontrada.</div>;

  const archivoAdjuntoUrl = getFileUrl(data.pedido_especializado.archivo_adicional);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-paw-purple mb-6 transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Volver al tablero
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === COLUMNA IZQUIERDA: EXPEDIENTE === */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="relative inline-block">
                <img 
                  src={data.mascota.foto || "https://via.placeholder.com/150"} 
                  alt={data.mascota.nombre}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-50"
                />
                <div className="absolute bottom-0 right-0 bg-paw-purple text-white p-1.5 rounded-full border-2 border-white">
                  <Dog size={16} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{data.mascota.nombre}</h2>
              <p className="text-gray-500 font-medium">{data.mascota.raza}</p>
              
              <div className="mt-4 flex justify-center gap-3 text-sm">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {data.mascota.edad} años
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {data.mascota.peso} kg
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {data.mascota.sexo === 'M' ? 'Macho' : 'Hembra'}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-400">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" /> Historial Clínico
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Alergias</p>
                  <div className="flex flex-wrap gap-2">
                    {data.detalles_nutricionales.alergias.length > 0 ? (
                      data.detalles_nutricionales.alergias.map((a, i) => (
                        <span key={i} className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-medium border border-red-100">
                          {a.alergia} ({a.severidad})
                        </span>
                      ))
                    ) : <span className="text-gray-500 text-sm">Ninguna registrada</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === COLUMNA DERECHA === */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Detalles de la Solicitud */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Solicitud del Cliente</h3>
                  <p className="text-sm text-gray-500">Fecha: {new Date(data.pedido.fecha).toLocaleDateString()}</p>
                </div>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {data.pedido.estado}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Objetivo Dietético</p>
                  <p className="font-semibold text-gray-800 text-lg mt-1">{data.pedido_especializado.objetivo_dieta}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Alimentación Actual</p>
                  <p className="font-medium text-gray-700 mt-1">{data.pedido_especializado.frecuencia_cantidad}</p>
                </div>
                {data.pedido_especializado.indicaciones && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase">Notas Adicionales</p>
                    <p className="text-gray-700 mt-1 italic">"{data.pedido_especializado.indicaciones}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ NUEVA SECCIÓN: VISOR DE ARCHIVOS ADJUNTOS */}
            {archivoAdjuntoUrl && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Paperclip size={20} /> Archivos Adjuntos del Cliente
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700">Examen / Receta Adjunta</p>
                      <p className="text-xs text-gray-500">Click para visualizar</p>
                    </div>
                  </div>
                  <a 
                    href={archivoAdjuntoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Eye size={16} /> Ver Archivo
                  </a>
                </div>
                
                {/* Previsualización si es imagen */}
                {(archivoAdjuntoUrl.endsWith('.jpg') || archivoAdjuntoUrl.endsWith('.png') || archivoAdjuntoUrl.endsWith('.jpeg')) && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                    <img src={archivoAdjuntoUrl} alt="Adjunto" className="w-full h-auto max-h-96 object-contain bg-gray-900" />
                  </div>
                )}
              </div>
            )}
            {/* ------------------------------------------------ */}

            {/* FORMULARIO DE RESPUESTA */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
              <h3 className="text-lg font-bold text-paw-purple mb-6 flex items-center gap-2">
                <FileText size={24} /> Resolución Profesional
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Diagnóstico y Observaciones</label>
                  <textarea 
                    rows="3"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-paw-purple/50 bg-gray-50 transition"
                    placeholder="Escribe tus observaciones sobre el estado de la mascota..."
                    value={form.observaciones}
                    onChange={e => setForm({...form, observaciones: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Plan Nutricional / Recomendaciones</label>
                  <textarea 
                    rows="5"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-paw-purple/50 bg-gray-50 transition"
                    placeholder="Detalla la dieta BARF recomendada..."
                    value={form.recomendaciones}
                    onChange={e => setForm({...form, recomendaciones: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex items-center gap-4 border-t border-gray-100 mt-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition ${form.aprobado ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                        {form.aprobado && <CheckCircle size={16} className="text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={form.aprobado}
                        onChange={e => setForm({...form, aprobado: e.target.checked})}
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition">Marcar como Aprobado</span>
                    </label>
                  </div>

                  <button 
                    onClick={enviarRevision}
                    className="bg-paw-yellow text-paw-dark px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-md flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Save size={20} /> Guardar Resolución
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SolicitudDetalle;