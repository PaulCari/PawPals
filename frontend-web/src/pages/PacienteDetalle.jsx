import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { ArrowLeft, Activity, FileText, Calendar, User } from 'lucide-react';

const PacienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        // Llamamos al endpoint que corregiste previamente
        const res = await api.get(`/cliente/mascotas/detalle/${id}`);
        setData(res.data);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) return <Layout><div className="p-10 text-center">Cargando historial...</div></Layout>;
  if (!data) return <Layout><div className="p-10 text-center">Paciente no encontrado</div></Layout>;

  return (
    <Layout>
      {/* Header y Botón volver */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-paw-dark">Historial Clínico: {data.nombre}</h1>
          <p className="text-gray-500">{data.raza} • {data.edad} años</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: RESUMEN SALUD */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="text-red-500" size={20}/> Condiciones & Alergias
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Alergias</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.alergias.length > 0 ? data.alergias.map((a, i) => (
                    <span key={i} className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold border border-red-100">
                      {a.alergia} ({a.severidad})
                    </span>
                  )) : <span className="text-gray-400 text-sm">Ninguna</span>}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Condiciones</p>
                <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                  {data.condiciones_salud.length > 0 ? data.condiciones_salud.map((c, i) => (
                    <li key={i}>{c.nombre}</li>
                  )) : <li className="list-none text-gray-400">Ninguna</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: TIMELINE DE CONSULTAS */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Consultas Realizadas</h3>
          
          <div className="space-y-6 relative border-l-2 border-gray-200 ml-3 pl-8 pb-10">
            {data.historial_nutricional && data.historial_nutricional.length > 0 ? (
              data.historial_nutricional.map((consulta) => (
                <div key={consulta.id} className="relative">
                  {/* Punto en la línea de tiempo */}
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-paw-purple border-4 border-white shadow-sm"></div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 text-paw-dark-light">
                        <Calendar size={18} />
                        <span className="font-bold">{new Date(consulta.fecha).toLocaleDateString()}</span>
                        <span className="text-gray-400 text-sm">{new Date(consulta.fecha).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                        <User size={14} /> {consulta.nutricionista}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Activity size={16} /> Diagnóstico
                        </h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{consulta.diagnostico}</p>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                          <FileText size={16} /> Plan Nutricional
                        </h4>
                        <p className="text-sm text-orange-900 whitespace-pre-wrap">{consulta.plan_nutricional}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No hay historial nutricional disponible.</p>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default PacienteDetalle;