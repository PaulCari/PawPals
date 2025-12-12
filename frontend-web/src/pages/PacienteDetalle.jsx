import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { ArrowLeft, Activity, FileText, Calendar, User, Download, Utensils, ShoppingBag, Clock } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportePDF from '../components/ReportePDF';
import CalculadoraKcal from '../components/CalculadoraKcal'; // ✅ Importamos la calculadora

const PacienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
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
      {/* === HEADER === */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-paw-dark">Historial Clínico: {data.nombre}</h1>
            <p className="text-gray-500">{data.raza} • {data.edad} años</p>
          </div>
        </div>

        {/* Botón para ir a crear dieta personalizada */}
        <button 
          onClick={() => navigate(`/pacientes/${id}/crear-dieta`)}
          className="bg-paw-purple text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-purple-800 transition shadow-md transform hover:-translate-y-0.5"
        >
          <Utensils size={18} /> Crear Menú Personalizado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLUMNA IZQUIERDA: RESUMEN SALUD & CALCULADORA === */}
        <div className="space-y-6">
          
          {/* 1. Tarjeta de Salud (Alergias) */}
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

          {/* 2. ✅ CALCULADORA NUTRICIONAL */}
          <CalculadoraKcal peso={data.peso} />

        </div>

        {/* === COLUMNA DERECHA: MENÚS Y CONSULTAS === */}
        <div className="lg:col-span-2">
          
          {/* 1. Fórmulas Activas (Menús) */}
          {data.menus_personalizados && data.menus_personalizados.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Utensils className="text-paw-purple" /> Fórmulas Activas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.menus_personalizados.map((menu) => (
                  <div key={menu.id} className="bg-gradient-to-br from-paw-dark to-purple-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group border border-white/10">
                    <div className="relative z-10">
                      
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                          <ShoppingBag size={20} className="text-paw-yellow" />
                        </div>
                        <span className="font-bold text-lg bg-white/10 px-3 py-1 rounded-lg">
                          S/ {menu.precio.toFixed(2)}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-lg mb-1">{menu.nombre}</h4>
                      <p className="text-purple-200 text-sm line-clamp-2 mb-4">{menu.descripcion}</p>

                      <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-xs text-purple-300 font-medium">
                        <Clock size={14} />
                        <span>Creado el: {new Date(menu.fecha).toLocaleDateString()}</span>
                      </div>

                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Historial de Consultas */}
          <h3 className="text-xl font-bold text-gray-800 mb-6">Consultas Realizadas</h3>
          
          <div className="space-y-6 relative border-l-2 border-gray-200 ml-3 pl-8 pb-10">
            {data.historial_nutricional && data.historial_nutricional.length > 0 ? (
              data.historial_nutricional.map((consulta) => (
                <div key={consulta.id} className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-paw-purple border-4 border-white shadow-sm"></div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-paw-dark-light">
                          <Calendar size={18} />
                          <span className="font-bold">{new Date(consulta.fecha).toLocaleDateString()}</span>
                        </div>
                        <span className="text-gray-400 text-xs ml-6">{new Date(consulta.fecha).toLocaleTimeString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                          <User size={14} /> {consulta.nutricionista}
                        </div>
                        
                        {/* Botón Descargar PDF */}
                        <PDFDownloadLink
                          document={<ReportePDF data={data} consulta={consulta} />}
                          fileName={`Receta_${data.nombre}_${new Date(consulta.fecha).toISOString().split('T')[0]}.pdf`}
                          className="flex items-center gap-2 text-sm bg-paw-yellow text-paw-dark px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition shadow-sm font-medium"
                        >
                          {({ loading }) => loading ? '...' : <><Download size={16} /> PDF</>}
                        </PDFDownloadLink>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Activity size={16} /> Diagnóstico</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{consulta.diagnostico}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2"><FileText size={16} /> Plan Nutricional</h4>
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